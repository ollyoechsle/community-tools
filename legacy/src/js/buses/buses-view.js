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