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
        this.jElement.delegate("select", "change", this.handleStopClick.bind(this));
    };

    BusDeparturesView.prototype.handleTabClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            direction = jTarget.data("direction");
        this.model.direction = direction;
        console.log("Changing direction to : " + direction);
        this.fire("changed");

    };

    BusDeparturesView.prototype.handleStopClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            locationIndex = jTarget.val();
        this.model.locationIndex = locationIndex;
        console.log("Changing location to : " + locationIndex);
        this.fire("changed");

    };

    BusDeparturesView.prototype.updateAll = function () {

        var tabsHTML = Mustache.to_html(BusDeparturesView.TABS, {
            list:this.model.getDirections()
        });
        this.jElement.find(".tabs").html(tabsHTML);

        var selectHTML = Mustache.to_html(BusDeparturesView.SELECT, {
            list:this.model.getAllStopsInDirection()
        });
        this.jElement.find(".otherStops").html(selectHTML);

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