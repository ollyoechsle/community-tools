(function (jQuery) {

    function Buses(selector) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.load();
        // update the view every 10 seconds
        setInterval(jQuery.proxy(this.updateAll, this), 10000);
        // retrieve more data from the server every 5 minutes
        setInterval(jQuery.proxy(this.load, this), 60000 * 5);
    }

    Buses.prototype.load = function () {
        jQuery.ajax({
                        url:"http://community-tools.appspot.com/buses",
                        dataType:"jsonp"
                    }).then(jQuery.proxy(this.handleLoad, this));
    };

    Buses.prototype.handleLoad = function (data) {
        this.setData(data);
        this.updateAll();
    };

    Buses.prototype.setData = function (json) {
        this.data = json;
    };

    Buses.prototype.updateAll = function () {

        if (!this.data) {
            return;
        }
        var html = mustache.to_html(Buses.LIST, {
            list:_.map(this.data, process)
        });

        this.jElement.html(html);

        if (this.data.length) {
            var first = this.data[0],
                timestamp = first.estimated || first.scheduled,
                inPast = moment(timestamp).diff(moment()) < 0;

            if (inPast) {
                this.jElement.find("tbody tr").eq(0).fadeOut();
                this.data.unshift();
            }

        }

    };

    function process(item) {

        var timestamp = item.estimated || item.scheduled,
            endOfToday = moment().eod().format(),
            time = moment(timestamp),
            afterToday = time.diff(endOfToday) > 0,
            tenMinutesTime = moment().add("m", 10),
            inTenMinutes = time.diff(tenMinutesTime) < 0,
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

    yaxham.modules.Buses = Buses;

})(jQuery);