/* Community Tools 1.0 */

console.log("Welcome to Yaxham!");
/**@namespace*/
window.yaxham = window.yaxham || {};
/**@namespace*/
window.yaxham.modules = window.yaxham.modules || {};
/**
 * @class
 */
var Subscribable = (function () {

    "use strict";

    /**
     * The Subscribable class is the underlying component in a pub/sub application providing the ability
     * to "fire" events and bind handlers using "on" and remove them again with "un"
     *
     * @constructor
     * @name Subscribable
     */
    function Subscribable() {
    }

    /**
     *
     * @param {Object} subscribable
     */
    Subscribable.prepareInstance = function(subscribable) {
        subscribable.__events = {};
        subscribable.__handlers = [];
        subscribable.on = Subscribable.on;
        subscribable.un = Subscribable.un;
        subscribable.fire = Subscribable.fire;
        subscribable.hasListener = Subscribable.hasListener;
    };

    /**
     * The events object stores the names of the events that have listeners and the numeric IDs of the handlers
     * that are listening to the events.
     * @type {Object[]}
     */
    Subscribable.prototype.__events = null;

    /**
     * The handlers object is an array of handlers that will respond to the events being fired.
     * @type {Object[]}
     */
    Subscribable.prototype.__handlers = null;

    /**
     *
     */
    Subscribable.prototype.on = function() {
        Subscribable.prepareInstance(this);
        return this.on.apply(this, arguments);
    };

    /**
     *
     */
    Subscribable.prototype.un = function() {
        return this;
    };

    /**
     *
     */
    Subscribable.prototype.fire = function() {
        return true;
    };

    /**
     * Checks for whether there are any listeners for the supplied event type, where the event type can either be the
     * string name of an event or an event constructor.
     *
     * When the eventType parameter is omitted, the method will check for a handler against any event type.
     *
     * @param {String|Function} [eventType]
     */
    Subscribable.prototype.hasListener = function(eventType) {
        return false;
    };

    /**
     * Fires the named event with any arguments used as the call to fire.
     *
     * @param {String} eventName
     */
    Subscribable.fire = function(eventName) {
        var i, l,
            returnValue,
            args,
            handler,
            handlerIds;

        if(typeof eventName == 'object') {
            args = [eventName];
            eventName = eventName.constructor.toString();
        }

        handlerIds = Subscribable._getHandlersList(this, eventName, false);

        if(handlerIds && handlerIds.length) {
            args = args || Array.prototype.slice.call(arguments, 1);
            for(returnValue, i = 0, l = handlerIds.length; i < l && returnValue !== false; i++) {
                if(handler = this.__handlers[handlerIds[i]]) {
                    returnValue = handler[0].apply(handler[1], args);
                }
            }
            return returnValue !== false;
        }

        return true;
    };

    /**
     * Gets the list of handler IDs for the supplied event name in the Subscribable instance. When
     * the create parameter is set to true and the event has not yet been set up in the Subscribable
     * it will be created.
     *
     * @param {Subscribable} instance
     * @param {String} eventName
     * @param {Boolean} create
     * @return {Number[]}
     */
    Subscribable._getHandlersList = function(instance, eventName, create) {
        eventName = ('' + eventName).toLowerCase();
        if(!instance.__events[eventName] && create) {
            instance.__events[eventName] = [];
        }
        return instance.__events[eventName];
    };

    /**
     * Attaches the supplied handler/scope as a listener in the supplied event list.
     *
     * @param {Function} handler
     * @param {Object} scope
     * @param {Number[]} eventList
     */
    Subscribable._saveHandler = function(instance, handler, scope, eventList) {
        var handlerId = instance.__handlers.length;
        instance.__handlers.push( [handler, scope, handlerId] );
        eventList.push(handlerId);

        return handlerId;
    };

    /**
     * Attaches the supplied handler and scope as a listener for the supplied event name. The return value is
     * the numerical ID of the handler that has been added to allow for removal of a single event handler in the
     * "un" method.
     *
     * @param {String} eventName
     * @param {Function} handler
     * @param {Object} scope
     * @return {Number}
     */
    Subscribable.on = function(eventName, handler, scope) {
        return Subscribable._saveHandler(this, handler, scope, Subscribable._getHandlersList(this, eventName, true));
    };

    /**
     * Remove handlers for the specified selector - the selector type can either be a number (which is the ID of a single
     * handler and is the result of using the .on method), a string event name (which is the same string used as the event
     * name in the .on method), the Function constructor of an event object (that has a .toString method to return the
     * name of the associated event) or an object that is the scope of a handler (in which case, any handler for any
     * event that uses that object as the scope will be removed).
     *
     * @param {Object|String|Number|Function} un
     * @param {Object} [scopeCheck]
     */
    Subscribable.un = function(un, scopeCheck) {
        var typeofRemoval = typeof un;
        switch(typeofRemoval) {
            case 'number':
                Subscribable.removeSingleEvent(this, un, scopeCheck);
                break;

            case 'string':
            case 'function':
                un = ('' + un).toLowerCase();
                Subscribable.removeMultipleEvents(this,
                    Subscribable._getHandlersList(this, un, false), scopeCheck);
                if(scopeCheck) {
                    Subscribable.consolidateEvents(this, un);
                }
                break;

            default:
                if(un) {
                    Subscribable.removeMultipleHandlers(this, this.__handlers, un || null);
                    Subscribable.consolidateEvents(this);
                }
                else {
                    this.__handlers = [];
                    this.__events = {};
                }
                break;
        }
    };

    /**
     * Consolidates the handler IDs registered for the supplied named event; when the event name is not specified
     * all event containers will be consolidated.
     *
     * @param {String} [eventName]
     */
    Subscribable.consolidateEvents = function(instance, eventName) {
        if(!arguments.length) {
            for(var eventName in instance.__events) {
                Subscribable.consolidateEvents(eventName);
            }
        }

        var handlerList = instance.__events[eventName];

        if(handlerList && handlerList.length) {
            for(var i = handlerList.length - 1; i >= 0; i--) {
                if(!instance.__handlers[handlerList[i]]) {
                    handlerList.splice(i,1);
                }
            }
        }

        if(handlerList && !handlerList.length) {
            delete instance.__events[eventName];
        }
    };

    /**
     * Attempts to nullify the handler with the supplied list of handler IDs in the Subscribable instance. If the
     * optional scopeCheck parameter is supplied, each handler will only be nullified when the scope it was attached
     * with is the same entity as the scopeCheck.
     *
     * @param {Subscribable} instance
     * @param {Number[]} handlerList
     * @param {Object} [scopeCheck]
     */
    Subscribable.removeMultipleEvents = function(instance, handlerList, scopeCheck) {
        for(var i = 0, l = handlerList.length; i < l; i++) {
            Subscribable.removeSingleEvent(instance, handlerList[i], scopeCheck);
        }
    };

    /**
     * Attempts to nullify the supplied handlers (note that in this case the handler array is the list of actual handlers
     * rather than their handler ID values). If the optional scopeCheck parameter is supplied, each handler will only be
     * nullified when the scope it was attached with the same entity as the scopeCheck.
     *
     * @param {Subscribable} instance
     * @param {Object[]} handlers
     * @param {Object} [scopeCheck]
     */
    Subscribable.removeMultipleHandlers = function(instance, handlers, scopeCheck) {
        var handler;
        for(var i = 0, l = handlers.length; i < l; i++) {
            if(handler = handlers[i]) {
                Subscribable.removeSingleEvent(instance, handler[2], scopeCheck);
            }
        }
    };

    /**
     * Attempts to nullify the handler with the supplied handler ID in the Subscribable instance. If the optional
     * scopeCheck parameter is supplied, the handler will only be nullified when the scope it was attached with is
     * the same entity as the scopeCheck.
     *
     * @param {Subscribable} instance
     * @param {Number} handlerId
     * @param {Object} [scopeCheck]
     */
    Subscribable.removeSingleEvent = function(instance, handlerId, scopeCheck) {
        if(instance.__handlers[handlerId]) {
            if(!scopeCheck || instance.__handlers[handlerId][1] === scopeCheck) {
                instance.__handlers[handlerId] = null;
            }
        }
    };

    /**
     *
     * @param {String|Function} [eventType]
     */
    Subscribable.hasListener = function(eventType) {
        var handlers, handlerIds, i, l;

        if(eventType === undefined) {
            handlers = this.__handlers;
            for(i = 0, l = handlers.length; i < l; i++) {
                if(!!handlers[i]) {
                    return true;
                }
            }
        }

        else if(handlerIds = this.__events[('' + eventType).toLowerCase()]) {
            for(var i = 0, l = handlerIds.length; i < l; i++) {
                if(this.__handlers[handlerIds[i]]) {
                    return true;
                }
            }
        }

        return false;
    };

    return Subscribable;

}());

/*
 * If this is being used in a browser as a requireJs or commonJs module, or is being used as part of a NodeJS
 * app, externalise the Subscribable constructor as module.exports
 */
if(typeof module !== 'undefined') {
    module.exports = Subscribable;
}
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
            url:WeatherController.URL + "/weather/hourly",
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

    WeatherController.URL  = "http://community-tools.appspot.com";

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
            var day = moment(period.value).format("ddd");
            for (var i = 0; i < period.Rep.length; i++) {
                period.Rep[i].day = day;
                allPeriods.push(period.Rep[i])
            }
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
                type: WeatherModel.WEATHER[reading.W].name,
                icon: WeatherModel.WEATHER[reading.W].className,
                chanceOfRain: reading.Pp,
                temperature: reading.T,
                windSpeed: reading.S,
                windDirection: reading.D,
                time: WeatherModel.timeOfReading[reading.$],
                day: reading.day
            }
        });
    };

    WeatherModel.prototype.getTemperatureRange = function () {
        var temperatures = this.allPeriods.map(function (reading) {
            return reading.T
        });
        return {
            max: Math.max.apply(null, temperatures),
            min: Math.min.apply(null, temperatures)
        }
    };

    WeatherModel.timeOfReading = {
        "0": "0:00",
        "180": "03:00",
        "360": "06:00",
        "540": "09:00",
        "720": "12:00",
        "900": "15:00",
        "1080": "18:00",
        "1260": "21:00"
    };

    WeatherModel.WEATHER = {
        "NA": {"name": "Not Available", className: "notAvailable"},
        "0": {"name": "Clear", className: "clearNight"},
        "1": {"name": "Sunny", className: "clearDay"},
        "2": {"name": "Partly cloudy", className: "clearNight"},
        "3": {"name": "Partly cloudy", className: "clearDay"},
        "5": {"name": "Mist", className: "fogMist"},
        "6": {"name": "Fog", className: "fogMist"},
        "7": {"name": "Cloudy", className: "cloudy"},
        "8": {"name": "Overcast", className: "cloudy"},

        "9": {"name": "Light rain shower", className: "lightRainShowerNight"},
        "10": {"name": "Light rain shower", className: "lightRainShowerDay"},

        "11": {"name": "Drizzle", className: "lightRain"},
        "12": {"name": "Light rain", className: "lightRain"},

        "13": {"name": "Heavy rain shower", className: "heavyRain"},
        "14": {"name": "Heavy rain shower", className: "heavyRain"},
        "15": {"name": "Heavy rain", className: "heavyRain"},

        "16": {"name": "Sleet shower", className: "sleet"},
        "17": {"name": "Sleet shower", className: "sleet"},
        "18": {"name": "Sleet", className: "sleet"},

        "19": {"name": "Hail shower", className: "lightSnowDay"},
        "20": {"name": "Hail shower", className: "lightSnowNight"},
        "21": {"name": "Hail", className: "lightSnowDay"},

        "22": {"name": "Light snow shower", className: "lightSnowDay"},
        "23": {"name": "Light snow shower", className: "lightSnowNight"},
        "24": {"name": "Light snow", className: "lightSnowDay"},

        "25": {"name": "Heavy snow shower", className: "heavySnow"},
        "26": {"name": "Heavy snow shower", className: "heavySnow"},
        "27": {"name": "Heavy snow", className: "heavySnow"},

        "28": {"name": "Thunder shower", className: "thunderStorm"},
        "29": {"name": "Thunder shower", className: "thunderStorm"},
        "30": {"name": "Thunder", className: "thunderStorm"}
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
                                     '<div class="big icon {{icon}}"></div>' +
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
                                   '<td><div class="icon {{icon}}">' +
                                   '<div class="time heading">{{time}}</div>' +
                                   '<div class="temperature reading">{{temperature}}&deg;C</div>' +
                                   '</li>' +
                                   '{{/forecasts}}';

    WeatherView.MARKUP = '' +
                         '<div class="weather vertical">' +
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

    function getView(element, model) {
        if (element.hasClass("horizontal")) {
            return new yaxham.modules.WeatherChartView(element, model)
        } else {
            return new yaxham.modules.WeatherView(element, model)
        }
    }

    yaxham.modules.Weather = function (selector) {

        jQuery(selector).each(function () {

            var model = new yaxham.modules.WeatherModel(),
                view = getView(jQuery(this), model),
                controller = new yaxham.modules.WeatherController(view, model);

            controller.initialise();

        });

    }

})();
(function () {

    function WeatherChartView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.initialise();
    }

    WeatherChartView.prototype = Object.create(Subscribable.prototype);

    WeatherChartView.prototype.jElement = null;

    WeatherChartView.prototype.initialise = function () {

        this.jElement
            .append(WeatherChartView.MARKUP)
            .delegate(".btn", "click.weather", this.handleNavigate.bind(this));
        this.weatherChart = new yaxham.modules.WeatherChart(this.jElement.find(".navigator"));

        this.numItems = Math.max(5, this.jElement.width() / 36);
        this.model.on("indexChanged", this.updateAll, this);
    };

    WeatherChartView.prototype.handleNavigate = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            direction = jTarget.data("direction");
        this.model.changeCurrentIndex(+direction);
    };

    WeatherChartView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    WeatherChartView.prototype.displayLoading = function () {
        this.jElement.find("currentConditions")
            .empty()
            .addClass("loading");
    };

    WeatherChartView.prototype.displayBoard = function () {

        var numItems = this.numItems,
            currentIndex = this.model.currentIndex,
            forecasts = this.model.getForecast().filter(function (forecast, index) {
                return index >= currentIndex && index < (currentIndex + numItems)
            }),
            temperatureRange = this.model.getTemperatureRange(),
            range = temperatureRange.max - temperatureRange.min;

        forecasts.forEach(function (forecast) {
            var pc = ((forecast.temperature - temperatureRange.min) / range) * 50;
            forecast.top = 50 - pc;
            forecast.className = forecast.time == "0:00" ? "startOfDay" : ""
            forecast.time = forecast.time == "0:00" ? forecast.day + "<br>" + forecast.time : "<br>" + forecast.time;
        });


        this.weatherChart.render(forecasts);

        this.jElement.find(".laterConditions").html(
            Mustache.to_html(WeatherChartView.LATER_CONDITIONS, {forecasts: forecasts})
        );
    };

    WeatherChartView.prototype.destroy = function () {
        this.jElement.undelegate(".weather");
        this.model.un(null, this);
    };

    WeatherChartView.LATER_CONDITIONS = '' +
        '{{#forecasts}}' +
        '<li class="{{className}}">' +
        '<div class="time heading">{{{time}}}</div>' +
        '<div class="precipitation" style="height: {{chanceOfRain}}px"></div>' +
        '<div class="fc" style="top: {{top}}px">' +
        '<div class="icon {{icon}}" title="{{type}}"></div>' +
        '<div class="temperature reading">{{temperature}}&deg;C</div>' +
        '</div>' +
        '</li>' +
        '{{/forecasts}}';

    WeatherChartView.MARKUP = '' +
        '<div class="weather horizontal">' +
        '<div class="navigator">' +
        '<div class="btn prev" data-direction="-1"></div>' +
        '<ul class="laterConditions"></ul>' +
        '<div class="btn next" data-direction="+1"></div>' +
        '</div>' +
        '<p class="attribution">Data: <a href="http://www.metoffice.gov.uk/public/weather/forecast/dereham">Met Office</a></p>' +
        '</div>';

    yaxham.modules.WeatherChartView = WeatherChartView;

})();
(function (jQuery) {

    function WeatherChart(container) {
        this.jContainer = jQuery(container);
        this.initialise();
    }

    WeatherChart.prototype.jContainer = null;
    WeatherChart.prototype.ctx = null;

    WeatherChart.prototype.getCanvas = function () {

        var canvas = document.createElement("canvas");
        canvas.width = this.jContainer.width() || 160;
        canvas.height = this.jContainer.height() || 160;
        this.jContainer[0].appendChild(canvas);

        if (window.G_vmlCanvasManager) {
            return window.G_vmlCanvasManager.initElement(canvas);
        } else {
            return canvas;
        }
    };

    WeatherChart.prototype.initialise = function () {
        var canvas = this.getCanvas();
        this.ctx = canvas.getContext('2d');
    };

    WeatherChart.prototype.render = function (forecast) {

        var ctx = this.ctx,
            fw = 36,
            cx = 0;

        ctx.clearRect(0, 0, 1000, 500);

        this.setStroke(WeatherChart.NOTCH);
        ctx.beginPath();
        ctx.moveTo(cx, forecast.top+2);
        for (var i = 0; i < 20 && i < forecast.length; i++) {
            ctx.lineTo(cx, forecast[i].top + 2);
            cx += fw;
        }
        ctx.stroke();

    };

    WeatherChart.prototype.setStroke = function (settings) {
        this.ctx.lineWidth = settings["stroke-width"];
        this.ctx.strokeStyle = settings["stroke"];
    };

    WeatherChart.NOTCH = {stroke: "#ccc", "stroke-width": 2};

    yaxham.modules.WeatherChart = WeatherChart;

})(window.jQuery);