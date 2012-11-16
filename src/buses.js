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
        var html = mustache.to_html(Buses.LIST, {
            list:_.map(json, process)
        });
        this.jElement.html(html);
    };

    function process(item) {

        var timestamp = item.estimated || item.scheduled,
            endOfToday = moment().eod().format(),
            time = moment(timestamp),
            afterToday = time.diff(endOfToday) > 0,
            formatStr = afterToday ? "ddd hh:mm" : "hh:mm";

        return {
            destination:item.destination,
            service:item.service,
            timestamp: timestamp,
            time:time.format(formatStr)
        }
    }

    /**
     * @type {String} Rendering the list of keywords
     */
    Buses.LIST = '' +
                 '<table class="table departures">'
                     + '<thead>'
                     + '<tr>'
                     + '<th class="service">Service</th>'
                     + '<th>To</th>'
                     + '<th>Departs</th>'
                     + '</tr>'
                     + '</thead>'
                     + '<tbody>' +
                 '{{#list}}' +
                 '<tr>' +
                 '<td class="service">{{service}}</td>' +
                 '<td>{{destination}}</td>' +
                 '<td><time datetime="{{timestamp}}">' +
                 '{{time}}' +
                 '</time></td>' +
                 '</tr>' +
                 '{{/list}}' +
                 '</tbody>' +
                 '</table>';

    yaxham.modules.Buses = Buses;

})(jQuery);