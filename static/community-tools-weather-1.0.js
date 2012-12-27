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

    function WeatherModel() {
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