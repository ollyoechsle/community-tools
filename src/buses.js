(function () {

    function Buses(selector) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.jElement.html(Buses.MARKUP);
        this.jBoard = this.jElement.find(".board");
        this.intervals = [];
        console.log("Buses, initialised with board ", this.jBoard);
    }

    Buses.prototype.initialise = function () {
        this.load();
        // update the board every 10 seconds
        this.intervals.push(setInterval(this.updateAll.bind(this), 10000));
        // retrieve more data from the server every 5 minutes
        this.intervals.push(setInterval(this.load.bind(this), 60000 * 5));
        this.updateAll();
    };

    Buses.prototype.load = function () {
        console.log("Starting to load...");
        var data = {
            url:Buses.URL,
            dataType:"jsonp"
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
    };

    Buses.prototype.handleLoad = function (data) {
        console.log("Finished loading");
        this.data = data;
        this.updateAll();
    };

    Buses.prototype.updateAll = function () {

        if (this.data) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    Buses.prototype.displayLoading = function () {
        console.log("Loading...");
        this.jBoard
            .addClass("loading")
            .html("Loading live bus departures...");
    };

    Buses.prototype.displayBoard = function () {
        console.log("Displaying board...");
        var html = Mustache.to_html(Buses.LIST, {
            list:this.data.map(process)
        });

        this.jBoard
            .removeClass("loading")
            .html(html);

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

    Buses.prototype.destroy = function() {
        this.intervals.forEach(function(interval) {
            window.clearInterval(interval);
        })
    };

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


    /**
     * @type {String}
     */
    Buses.LIST = '' +
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

    Buses.MARKUP = '<h2>Bus Departures</h2>' +
                   '<ul class="tabs">' +
                   '<li class="selected">To Dereham</li>' +
                   '<li>To Norwich</li>' +
                   '</ul>' +
                   '<div class="board"></div>';

    Buses.URL = "http://community-tools.appspot.com/buses";

    yaxham.modules.Buses = Buses;

})();