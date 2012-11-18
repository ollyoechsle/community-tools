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

        var tabsHTML = Mustache.to_html(BusDeparturesView.TABS, {
            list:this.model.directions
        });

        this.jElement
            .append(BusDeparturesView.HEADING)
            .append(tabsHTML)
            .append(BusDeparturesView.BOARD);

        this.jBoard = this.jElement.find(".board");
        this.jElement.delegate(".tabs li:not(.selected)", "click", this.handleTabClick.bind(this));
    };

    BusDeparturesView.prototype.handleTabClick = function(jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            stop = jTarget.data("stop");

        console.log("Changing stop to : " + stop);
        this.fire("stopChanged", stop);

    };

    BusDeparturesView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    BusDeparturesView.prototype.displayLoading = function () {
        console.log("Loading...");
        this.jBoard
            .addClass("loading")
            .html("Loading live bus departures...");
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

    BusDeparturesView.prototype.destroy = function() {
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

    BusDeparturesView.HEADING = '<h2>Bus Departures</h2>';
    BusDeparturesView.BOARD = '<div class="board"></div>';
    BusDeparturesView.TABS = '<ul class="tabs">' +
                             '{{#list}}' +
                             '<li data-stop="{{stop}}" class="{{className}}">{{direction}}</li>' +
                             '{{/list}}' +
                             '</ul>';

    yaxham.modules.BusDeparturesView = BusDeparturesView;

})();