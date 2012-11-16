(function (jQuery) {

    function Buses(selector) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.load();
    }

    Buses.prototype.load = function () {
        console.log("Loading bus data...");
        jQuery.ajax({
                        url:"http://localhost:8080/buses",
                        dataType:"jsonp"
                    }
        ).then(jQuery.proxy(this.display, this));
    };

    Buses.prototype.display = function (json) {
        console.log("Displaying bus data: " + json);
        var html = mustache.to_html(Buses.LIST, {list:json});
        this.jElement.html(html);
    };

    /**
     * @type {String} Rendering the list of keywords
     */
    Buses.LIST = '' +
                 '<table class="departures">'
                     + '<thead>'
                     + '<tr>'
                     + '<th>Destination</th>'
                     + '<th>Time</th>'
                     + '</tr>'
                     + '</thead>' +
                 '{{#list}}' +
                 '<tr>' +
                 '<td>{{destination}}</td>' +
                 '<td>{{scheduled}}</td>' +
                 '</tr>' +
                 '{{/list}}' +
                 '</table>';

    yaxham.modules.Buses = Buses;

})(jQuery);