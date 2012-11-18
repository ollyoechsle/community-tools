/* Community Tools 1.0 */

console.log("Welcome to Yaxham!");
/**@namespace*/
window.yaxham = window.yaxham || {};
/**@namespace*/
window.yaxham.modules = window.yaxham.modules || {};
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
        // retrieve more data from the server every 5 minutes
        this.intervals.push(setInterval(this.load.bind(this), 60000 * 5));
        this.view.updateAll();
        this.view.on("stopChanged", this.handleStopChanged.bind(this));
    };

    BusDeparturesController.prototype.handleStopChanged = function (stopId) {
        this.model.data = null;
        this.model.stopId = stopId;
        this.load();
        this.view.updateAll();
    };

    BusDeparturesController.prototype.load = function () {
        console.log("Loading data from " + BusDeparturesController.URL);
        var data = {
            url:BusDeparturesController.URL,
            dataType:"jsonp",
            data:{
                stop:this.model.stopId
            }
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
    };

    BusDeparturesController.prototype.handleLoad = function (data) {
        console.log("Finished loading");
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
        var stops = this.getStops("opp");
        console.log(stops);
        this.stopId = stops[0].NaptanCode;
    }

    BusDeparturesModel.stopId = null;

    BusDeparturesModel.data = null;

    BusDeparturesModel.prototype.hasData = function () {
        return !!this.data;
    };

    BusDeparturesModel.prototype.getDepartures = function () {
        return this.data
            .map(process)
            .filter(noMoreThan5)
    };

    BusDeparturesModel.prototype.getDirections = function () {
        return BusDeparturesModel.INDICATORS.map(function (obj) {
            var stop = this.getStops(obj.indicator)[0];
            return {
                direction:obj.label,
                stop:stop.NaptanCode,
                className:stop.NaptanCode == this.stopId ? "selected" : ""
            }
        }.bind(this))
    };

    BusDeparturesModel.prototype.getStops = function (indicator) {
        return BusDeparturesModel.STOPS.filter(function (stop) {
            return stop.Indicator == indicator;
        })
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

    function process(item) {

        var timestamp = item.estimated || item.scheduled,
            endOfToday = moment().eod().format(),
            time = moment(timestamp),
            afterToday = time.diff(endOfToday) > 0,
            fiveMinutesTime = moment().add("m", 5),
            inTenMinutes = time.diff(fiveMinutesTime) < 0,
            formatStr = afterToday ? "ddd HH:mm" : "HH:mm";

        return {
            destination:item.destination,
            service:item.service,
            timestamp:timestamp,
            time:time.format(formatStr),
            inTime:time.fromNow(),
            className:inTenMinutes ? "iminent" : ""
        }
    }

    BusDeparturesModel.INDICATORS = [
        {
            indicator:"adj",
            label:"To Dereham"
        },
        {
            indicator:"opp",
            label:"To Norwich"
        }
    ];

    BusDeparturesModel.STOPS = [
        {
            "NaptanCode":"nfogjmpt",
            "CommonName":"Bus Shelter",
            "Landmark":"The Rosary",
            "Street":"Norwich Road",
            "Indicator":"adj",
            "LocalityName":"Yaxham",
            "Longitude":0.96479,
            "Latitude":52.6557
        },
        {
            "NaptanCode":"nfogjmpw",
            "CommonName":"Well Hill",
            "Landmark":"Well Hill",
            "Street":"Norwich Road",
            "Indicator":"opp",
            "LocalityName":"Clint Green",
            "Longitude":0.98935,
            "Latitude":52.65937
        },
        {
            "NaptanCode":"nfogjmta",
            "CommonName":"Bus Shelter",
            "Landmark":"The Rosary",
            "Street":"Norwich Road",
            "Indicator":"opp",
            "LocalityName":"Yaxham",
            "Longitude":0.96461,
            "Latitude":52.65584
        },
        {
            "NaptanCode":"nfogjmtd",
            "CommonName":"Well Hill",
            "Landmark":"Well Hill",
            "Street":"Norwich Road",
            "Indicator":"adj",
            "LocalityName":"Clint Green",
            "Longitude":0.98847,
            "Latitude":52.65877
        },
        {
            "NaptanCode":"nfogjmtg",
            "CommonName":"Elm Close",
            "Landmark":"St. Peters Close",
            "Street":"Norwich Road",
            "Indicator":"opp",
            "LocalityName":"Yaxham",
            "Longitude":0.9689,
            "Latitude":52.65518
        },
        {
            "NaptanCode":"nfogjmtj",
            "CommonName":"Elm Close",
            "Landmark":"Elm Close",
            "Street":"Norwich Road",
            "Indicator":"adj",
            "LocalityName":"Yaxham",
            "Longitude":0.96829,
            "Latitude":52.65514
        },
        {
            "NaptanCode":"nfogmtdw",
            "CommonName":"Station Road",
            "Landmark":"Station Road",
            "Street":"Dereham Road",
            "Indicator":"opp",
            "LocalityName":"Yaxham",
            "Longitude":0.96239,
            "Latitude":52.65583
        },
        {
            "NaptanCode":"nfogpdjd",
            "CommonName":"Station Road",
            "Landmark":"",
            "Street":"Dereham Road",
            "Indicator":"adj",
            "LocalityName":"Yaxham",
            "Longitude":0.96207,
            "Latitude":52.65608
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
        console.log("Buses, initialised with board ", this.jBoard);
    }

    BusDeparturesView.prototype = Object.create(Subscribable.prototype);

    BusDeparturesView.prototype.jElement = null;
    BusDeparturesView.prototype.jBoard = null;

    BusDeparturesView.prototype.initialise = function () {
        this.jElement.append(BusDeparturesView.MARKUP);
        this.jBoard = this.jElement.find(".board");
        this.jElement.delegate(".tabs li:not(.selected)", "click", this.handleTabClick.bind(this));
    };

    BusDeparturesView.prototype.handleTabClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            stop = jTarget.data("stop");

        console.log("Changing stop to : " + stop);
        this.fire("stopChanged", stop);

    };

    BusDeparturesView.prototype.updateAll = function () {

        var tabsHTML = Mustache.to_html(BusDeparturesView.TABS, {
                    list:this.model.getDirections()
                });
        this.jElement.find(".tabs").html(tabsHTML);

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    BusDeparturesView.prototype.displayLoading = function () {
        console.log("Loading...");
        this.jBoard
            .addClass("loading");
    };

    BusDeparturesView.prototype.displayBoard = function () {
        console.log("Displaying board...");

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

    BusDeparturesView.MARKUP = '<h2>Bus Departures</h2><ul class="tabs"></ul><div class="board"></div>';
    BusDeparturesView.TABS = '{{#list}}' +
                             '<li data-stop="{{stop}}" class="{{className}}">{{direction}}</li>' +
                             '{{/list}}';

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