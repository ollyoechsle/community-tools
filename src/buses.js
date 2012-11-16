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

        json[0].estimated = moment().add('m', 5).format("YYYY-MM-DDTHH:mm:ss z");

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
            tenMinutesTime = moment().add("m", 10),
            inTenMinutes = time.diff(tenMinutesTime) < 0,
            formatStr = afterToday ? "ddd hh:mm" : "hh:mm";

        return {
            destination:item.destination,
            service:item.service,
            timestamp:timestamp,
            time:time.format(formatStr),
            inTime:time.fromNow(),
            className:inTenMinutes ? "iminent" : ""
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
                     + '<th>In</th>'
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

    yaxham.modules.Buses = Buses;

})(jQuery);