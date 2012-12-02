/* Community Tools 1.0 */

console.log("Welcome to Yaxham!");
/**@namespace*/
window.yaxham = window.yaxham || {};
/**@namespace*/
window.yaxham.modules = window.yaxham.modules || {};
(function () {

    function HSelector(jElement) {
        this.jElement = jElement;
        this.initialise();
    }

    HSelector.prototype = Object.create(Subscribable.prototype);

    HSelector.prototype.initialise = function () {
        this.jElement.html(HSelector.HTML);
        this.jElement.delegate(".arrow.enabled", "click", this.handleClick.bind(this));
    };

    HSelector.prototype.handleClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget);
        if (jTarget.hasClass("left")) {
            this.fire("changed", this.selectedIndex - 1);
        } else {
            this.fire("changed", this.selectedIndex + 1);
        }
    };

    HSelector.prototype.empty = function() {
        this.jElement.css("visibility", "hidden");
    };

    HSelector.prototype.render = function (values, selectedIndex) {

        this.jElement.css("visibility", "visible");
        var selectedValue = values[selectedIndex].label;

        this.jElement.find(".value").html(selectedValue);
        this.jElement.find(".left").toggleClass("enabled", selectedIndex > 0);
        this.jElement.find(".right").toggleClass("enabled", selectedIndex < values.length - 1);

        this.selectedIndex = selectedIndex;

    };

    HSelector.HTML = '' +
                     '<div class="hselector">' +
                     '<div class="arrow left">&#8592;</div>' +
                     '<div class="value"></div>' +
                     '<div class="arrow right">&#8594;</div>' +
                     '</div>';

    window.HSelector = HSelector;

})();
(function () {

    function BusDeparturesController(view, model) {
        this.intervals = [];
        this.view = view;
        this.model = model;
    }

    BusDeparturesController.prototype.initialise = function () {
        this.load();
        // update the board every 10 seconds
        this.intervals.push(setInterval(this.view.updateAll.bind(this.view), 10000));
        // retrieve more data from the server every 10 minutes
        this.intervals.push(setInterval(this.load.bind(this), 60000 * 10));
        this.view.updateAll();
        this.view.on("changed", this.handleModelChanged.bind(this));
    };

    BusDeparturesController.prototype.handleModelChanged = function () {
        this.model.data = null;
        this.load();
        this.view.updateAll();
    };

    BusDeparturesController.prototype.load = function () {
        var data = {
            url:BusDeparturesController.URL,
            dataType:"jsonp",
            data:{
                stop:this.model.getFirstStop().NaptanCode
            }
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
    };

    BusDeparturesController.prototype.handleLoad = function (data) {
        this.model.data = data;
        this.view.updateAll();
    };

    BusDeparturesController.prototype.destroy = function () {
        this.intervals.forEach(function (interval) {
            window.clearInterval(interval);
        });
        this.view.destroy();
    };

    BusDeparturesController.URL = "http://community-tools.appspot.com/buses";

    yaxham.modules.BusDeparturesController = BusDeparturesController;

})();
(function () {

    function BusDeparturesModel(view) {
        this.view = view;
        this.locationIndex = 0;
        this.direction = "dereham";
    }

    BusDeparturesModel.locationIndex = null;
    BusDeparturesModel.direction = null;
    BusDeparturesModel.data = null;

    BusDeparturesModel.prototype.hasData = function () {
        return !!this.data;
    };

    BusDeparturesModel.prototype.getDepartures = function () {
        var delta = this.getStop().delta;
        return this.data
            .filter(noMoreThan5)
            .map(function (departure) {
                     var timestamp = departure.estimated || departure.scheduled,
                         endOfToday = moment().eod().format(),
                         departureTime = moment(timestamp).add("s", delta),
                         afterToday = departureTime.diff(endOfToday) > 0,
                         threeMinutesTime = moment().add("m", 5),
                         inTenMinutes = departureTime.diff(threeMinutesTime) < 0,
                         formatStr = afterToday ? "ddd HH:mm" : "HH:mm";

                     return {
                         destination:departure.destination,
                         service:departure.service,
                         timestamp:timestamp,
                         time:departureTime.format(formatStr),
                         inTime:departureTime.fromNow(),
                         className:inTenMinutes ? "iminent" : ""
                     }
                 })
    };

    BusDeparturesModel.prototype.getDirections = function () {
        return BusDeparturesModel.DIRECTIONS.map(function (direction) {
            return {
                direction:direction.direction,
                label:direction.label,
                className:direction.direction == this.direction ? "selected" : ""
            }
        }.bind(this))
    };

    BusDeparturesModel.prototype.getStop = function () {
        return BusDeparturesModel.LOCATIONS[this.locationIndex][this.direction];
    };

    BusDeparturesModel.prototype.getFirstStop = function () {
        return BusDeparturesModel.LOCATIONS[0][this.direction];
    };

    BusDeparturesModel.prototype.getAllStopsInDirection = function (indicator) {
        return BusDeparturesModel.LOCATIONS.map(function (location, index) {
            var stop = location[this.direction];
            return {
                label:stop.CommonName,
                locationIndex:index
            }
        }.bind(this))
    };

    BusDeparturesModel.prototype.firstDepartureAlreadyLeft = function () {

        if (this.data.length) {
            var first = this.data[0],
                timestamp = first.estimated || first.scheduled,
                inPast = moment(timestamp).diff(moment()) < 0;

            if (inPast) {
                this.data.unshift();
                return true;
            }

        }

        return false;

    };

    function noMoreThan5(val, i) {
        return i < 5;
    }

    BusDeparturesModel.DIRECTIONS = [
        {
            direction:"dereham",
            label:"To Dereham"
        },
        {
            direction:"norwich",
            label:"To Norwich"
        }
    ];

    BusDeparturesModel.LOCATIONS = [
        {
            dereham:{
                "NaptanCode":"nfogpdjd",
                "CommonName":"Station Road",
                "Landmark":"",
                "Street":"Dereham Road",
                "Indicator":"adj",
                "LocalityName":"Yaxham",
                "Longitude":0.96207,
                "Latitude":52.65608,
                "delta":0
            },
            norwich:{
                "NaptanCode":"nfogmtdw",
                "CommonName":"Station Road",
                "Landmark":"Station Road",
                "Street":"Dereham Road",
                "Indicator":"opp",
                "LocalityName":"Yaxham",
                "Longitude":0.96239,
                "Latitude":52.65583,
                "delta":0
            }
        },
        {
            "dereham":{
                "NaptanCode":"nfogjmpt",
                "CommonName":"Bus Shelter",
                "Landmark":"The Rosary",
                "Street":"Norwich Road",
                "Indicator":"adj",
                "LocalityName":"Yaxham",
                "Longitude":0.96479,
                "Latitude":52.6557,
                "delta":-30
            },
            "norwich":{
                "NaptanCode":"nfogjmta",
                "CommonName":"Bus Shelter",
                "Landmark":"The Rosary",
                "Street":"Norwich Road",
                "Indicator":"opp",
                "LocalityName":"Yaxham",
                "Longitude":0.96461,
                "Latitude":52.65584,
                delta:30
            }
        },
        {
            "dereham":{
                "NaptanCode":"nfogjmtj",
                "CommonName":"Elm Close",
                "Landmark":"Elm Close",
                "Street":"Norwich Road",
                "Indicator":"adj",
                "LocalityName":"Yaxham",
                "Longitude":0.96829,
                "Latitude":52.65514,
                delta:-180
            },
            "norwich":{
                "NaptanCode":"nfogjmtg",
                "CommonName":"Elm Close",
                "Landmark":"St. Peters Close",
                "Street":"Norwich Road",
                "Indicator":"opp",
                "LocalityName":"Yaxham",
                "Longitude":0.9689,
                "Latitude":52.65518,
                delta:60
            }
        },
        {
            "dereham":{
                "NaptanCode":"nfogjmtd",
                "CommonName":"Well Hill",
                "Landmark":"Well Hill",
                "Street":"Norwich Road",
                "Indicator":"adj",
                "LocalityName":"Clint Green",
                "Longitude":0.98847,
                "Latitude":52.65877,
                delta:-240
            },
            "norwich":{
                "NaptanCode":"nfogjmpw",
                "CommonName":"Well Hill",
                "Landmark":"Well Hill",
                "Street":"Norwich Road",
                "Indicator":"opp",
                "LocalityName":"Clint Green",
                "Longitude":0.98935,
                "Latitude":52.65937,
                delta:120
            }
        }

    ];

    yaxham.modules.BusDeparturesModel = BusDeparturesModel;

})();
(function () {

    function BusDeparturesView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.initialise();
    }

    BusDeparturesView.prototype = Object.create(Subscribable.prototype);

    BusDeparturesView.prototype.jElement = null;
    BusDeparturesView.prototype.jBoard = null;
    BusDeparturesView.prototype.selector = null;

    BusDeparturesView.prototype.initialise = function () {
        this.jElement.append(BusDeparturesView.MARKUP);
        this.jBoard = this.jElement.find(".board");
        this.selector = new HSelector(this.jElement.find(".otherStops"));
        this.jElement.delegate(".tabs li:not(.selected)", "click", this.handleTabClick.bind(this));
        this.selector.on("changed", this.handleStopClick.bind(this));
    };

    BusDeparturesView.prototype.handleTabClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget);
        this.model.direction = jTarget.data("direction");
        this.fire("changed");
    };

    BusDeparturesView.prototype.handleStopClick = function (locationIndex) {
        this.model.locationIndex = locationIndex;
        this.updateAll();
    };

    BusDeparturesView.prototype.updateAll = function () {

        var tabsHTML = Mustache.to_html(BusDeparturesView.TABS, {
            list:this.model.getDirections()
        });
        this.jElement.find(".tabs").html(tabsHTML);

        this.selector.render(this.model.getAllStopsInDirection(), this.model.locationIndex);

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    BusDeparturesView.prototype.displayLoading = function () {
        this.jBoard
            .empty()
            .addClass("loading");
        this.selector.empty();
    };

    BusDeparturesView.prototype.displayBoard = function () {

        var data = {
            list:this.model.getDepartures()
        };

        var html = Mustache.to_html(BusDeparturesView.LIST, data);

        this.jBoard
            .removeClass("loading")
            .html(html);

        if (this.model.firstDepartureAlreadyLeft()) {
            this.jElement.find("tbody tr").eq(0).fadeOut();
        }

    };

    BusDeparturesView.prototype.destroy = function () {
        this.jElement.undelegate();
    };

    /**
     * @type {String}
     */
    BusDeparturesView.LIST = '' +
                             '<table class="table">'
                                 + '<thead>'
                                 + '<tr>'
                                 + '<th class="service">Service</th>'
                                 + '<th>To</th>'
                                 + '<th>Departs</th>'
                                 + '<th></th>'
                                 + '</tr>'
                                 + '</thead>'
                                 + '<tbody>' +
                             '{{#list}}' +
                             '<tr class="{{className}}">' +
                             '<td class="service">{{service}}</td>' +
                             '<td>{{destination}}</td>' +
                             '<td class="time"><time datetime="{{timestamp}}">' +
                             '{{time}}' +
                             '</time></td>' +
                             '<td class="inTime">{{inTime}}</td>' +
                             '</tr>' +
                             '{{/list}}' +
                             '</tbody>' +
                             '</table>';

    BusDeparturesView.MARKUP = '' +
                               '<h2>Bus Departures</h2>' +
                               '<ul class="tabs"></ul>' +
                               '<div class="otherStops"></div>' +
                               '<div class="board"></div>';

    BusDeparturesView.TABS = '{{#list}}' +
                             '<li data-direction="{{direction}}" class="{{className}}">{{label}}</li>' +
                             '{{/list}}';

    BusDeparturesView.SELECT = '' +
                               '<select>' +
                               '{{#list}}' +
                               '<option value="{{locationIndex}}">{{label}}</option>' +
                               '{{/list}}' +
                               '</select>';

    yaxham.modules.BusDeparturesView = BusDeparturesView;

})();
(function () {

    yaxham.modules.Buses = function(element) {

        var model = new yaxham.modules.BusDeparturesModel(),
            view = new yaxham.modules.BusDeparturesView(element, model),
            controller = new yaxham.modules.BusDeparturesController(view, model);

        return controller;

    }

})();
(function () {

    function WeatherController(view, model) {
        this.intervals = [];
        this.view = view;
        this.model = model;
    }

    WeatherController.prototype.initialise = function () {
        this.load();
        this.intervals.push(setInterval(this.load.bind(this), 60000 * 5));
        this.view.updateAll();
    };

    WeatherController.prototype.load = function () {
        var data = {
            url:WeatherController.URL,
            dataType:"jsonp"
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
    };

    WeatherController.prototype.handleLoad = function (data) {
        this.model.setAllData(data);
        this.view.updateAll();
    };

    WeatherController.prototype.destroy = function () {
        this.intervals.forEach(function (interval) {
            window.clearInterval(interval);
        });
        this.view.destroy();
    };

    WeatherController.URL = "http://community-tools.appspot.com/weather";

    yaxham.modules.WeatherController = WeatherController;

})();
(function () {

    function WeatherModel(view) {
        this.view = view;
        this.currentIndex = 0;
    }

    WeatherModel.prototype = Object.create(Subscribable.prototype);

    WeatherModel.currentIndex = 0;
    WeatherModel.direction = null;
    WeatherModel.data = null;

    WeatherModel.prototype.hasData = function () {
        return !!this.data;
    };

    WeatherModel.prototype.setAllData = function (json) {
        this.data = json;
        var periods = json.SiteRep.DV.Location.Period,
            allPeriods = [];
        periods.forEach(function (period) {
            Array.prototype.push.apply(allPeriods, period.Rep);
        });
        this.allPeriods = allPeriods;
    };

    WeatherModel.prototype.changeCurrentIndex = function (delta) {
        this.currentIndex += delta;
        this.currentIndex = Math.max(0, this.currentIndex);
        this.currentIndex = Math.min(this.currentIndex, this.allPeriods.length - 1);
        this.fire("indexChanged");
    };

    WeatherModel.prototype.hasPrev = function () {
        return this.currentIndex > 0;
    };

    WeatherModel.prototype.hasNext = function () {
        return this.currentIndex < this.allPeriods.length - 1;
    };

    WeatherModel.prototype.getForecast = function () {
        var currentIndex = this.currentIndex;
        return this.allPeriods.map(function (reading, index) {
            return {
                className: index == currentIndex ? "current" : "notCurrent",
                type:WeatherModel.WEATHER[reading.W].name,
                icon:WeatherModel.WEATHER[reading.W].img,
                chanceOfRain:reading.Pp,
                temperature:reading.T,
                windSpeed:reading.S,
                windDirection:reading.D,
                time:WeatherModel.timeOfReading[reading.$]
            }
        });
    };

    WeatherModel.timeOfReading = {
        "0":"0:00",
        "180":"03:00",
        "360":"06:00",
        "540":"09:00",
        "720":"12:00",
        "900":"15:00",
        "1080":"18:00",
        "1260":"21:00"
    };

    WeatherModel.WEATHER = {
        "NA":{"name":"Not Available", img:""},
        "0":{"name":"Clear", img:"01n.png"},
        "1":{"name":"Sunny", img:"01d.png"},
        "2":{"name":"Partly cloudy", img:"01n.png"},
        "3":{"name":"Partly cloudy", img:"01d.png"},
        "5":{"name":"Mist", img:"15.png"},
        "6":{"name":"Fog", img:"15.png"},
        "7":{"name":"Cloudy", img:"04.png"},
        "8":{"name":"Overcast", img:"04.png"},

        "9":{"name":"Light rain shower", img:"05n.png"},
        "10":{"name":"Light rain shower", img:"05d.png"},

        "11":{"name":"Drizzle", img:"09.png"},
        "12":{"name":"Light rain", img:"09.png"},

        "13":{"name":"Heavy rain shower", img:"10.png"},
        "14":{"name":"Heavy rain shower", img:"10.png"},
        "15":{"name":"Heavy rain", img:"10.png"},

        "16":{"name":"Sleet shower", img:"12.png"},
        "17":{"name":"Sleet shower", img:"12.png"},
        "18":{"name":"Sleet", img:"12.png"},

        "19":{"name":"Hail shower", img:"08d.png"},
        "20":{"name":"Hail shower", img:"08n.png"},
        "21":{"name":"Hail", img:"08d.png"},

        "22":{"name":"Light snow shower", img:"08d.png"},
        "23":{"name":"Light snow shower", img:"08n.png"},
        "24":{"name":"Light snow", img:"08d.png"},

        "25":{"name":"Heavy snow shower", img:"13.png"},
        "26":{"name":"Heavy snow shower", img:"13.png"},
        "27":{"name":"Heavy snow", img:"13.png"},

        "28":{"name":"Thunder shower", img:"11.png"},
        "29":{"name":"Thunder shower", img:"11.png"},
        "30":{"name":"Thunder", img:"11.png"}
    };

    yaxham.modules.WeatherModel = WeatherModel;

})();
(function () {

    function WeatherView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.initialise();
    }

    WeatherView.prototype = Object.create(Subscribable.prototype);

    WeatherView.prototype.jElement = null;

    WeatherView.prototype.initialise = function () {
        this.jElement
            .append(WeatherView.MARKUP)
            .delegate(".btn", "click.weather", this.handleNavigate.bind(this));
        this.model.on("indexChanged", this.updateAll, this);
    };

    WeatherView.prototype.handleNavigate = function(jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            direction = jTarget.data("direction");
        this.model.changeCurrentIndex(+direction);
    };

    WeatherView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    WeatherView.prototype.displayLoading = function () {
        this.jElement.find("currentConditions")
            .empty()
            .addClass("loading");
    };

    WeatherView.prototype.displayBoard = function () {

        var currentIndex = this.model.currentIndex,
            forecasts = this.model.getForecast(),
            currentConditions = forecasts[currentIndex],
            laterConditions = forecasts.filter(function(forecast, index) {
                return index >= currentIndex && index < (currentIndex + 4)
            });

        this.jElement.find(".currentConditions").html(
            Mustache.to_html(WeatherView.CURRENT_CONDITIONS, currentConditions)
            );

        this.jElement.find(".laterConditions").html(
            Mustache.to_html(WeatherView.LATER_CONDITIONS, {forecasts: laterConditions})
            );
    };

    WeatherView.prototype.destroy = function () {
        this.jElement.undelegate(".weather");
        this.model.un(null, this);
    };

    WeatherView.CURRENT_CONDITIONS = '' +
                                     '<img class="icon" src="img/weather/icons_120x100/{{icon}}"/>' +
                                     '<ul>' +
                                     '<li>' +
                                     '<div class="weatherType">{{type}}</div>' +
                                     '<div class="temperature">{{temperature}}&deg;C</div>' +
                                     '</li>' +
                                     '<li class="otherDetails">' +
                                     '<div class="heading">Rain</div>' +
                                     '<div class="rainChance reading">{{chanceOfRain}}%</div>' +
                                     '<div class="heading">Wind</div>' +
                                     '<div class="windSpeed reading">{{windSpeed}} mph {{windDirection}}</div>' +
                                     '</li>' +
                                     '</ul>';

    WeatherView.LATER_CONDITIONS = '' +
                                   '{{#forecasts}}' +
                                   '<li class="{{className}}">' +
                                   '<td><img width="60" height="50" src="/static/img/weather/icons_60x50/{{icon}}" /></td>' +
                                   '<div class="time heading">{{time}}</div>' +
                                   '<div class="temperature reading">{{temperature}}&deg;C</div>' +
                                   '</li>' +
                                   '{{/forecasts}}';

    WeatherView.MARKUP = '' +
                         '<div class="weather">' +
                         '<div class="currentConditions"></div>' +
                         '<div class="navigator">' +
                         '<div class="btn prev" data-direction="-1"></div>' +
                         '<ul class="laterConditions"></ul>' +
                         '<div class="btn next" data-direction="+1"></div>' +
                         '</div>' +
                         '<p class="attribution">Data: <a href="http://www.metoffice.gov.uk/public/weather/forecast/dereham">Met Office</a></p>' +
                         '</div>';

    yaxham.modules.WeatherView = WeatherView;

})();
(function () {

    yaxham.modules.Weather = function(element) {

        var model = new yaxham.modules.WeatherModel(),
            view = new yaxham.modules.WeatherView(element, model),
            controller = new yaxham.modules.WeatherController(view, model);

        return controller;

    }

})();