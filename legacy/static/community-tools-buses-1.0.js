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

    function BusDeparturesModel() {
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
                                 + '<th class="service">No.</th>'
                                 + '<th>Toward</th>'
                                 + '<th class="time">Departs</th>'
                                 + '</tr>'
                                 + '</thead>'
                                 + '<tbody>' +
                             '{{#list}}' +
                             '<tr class="{{className}}">' +
                             '<td class="service">{{service}}</td>' +
                             '<td>{{destination}}</td>' +
                             '<td class="time"><time datetime="{{timestamp}}">' +
                             '{{time}}' +
                             '</time>' +
                             '<div class="inTime">{{inTime}}</div>' +
                             '</td>' +
                             '</tr>' +
                             '{{/list}}' +
                             '</tbody>' +
                             '</table>';

    BusDeparturesView.MARKUP = '' +
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