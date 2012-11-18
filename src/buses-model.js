(function () {

    function BusDeparturesModel(view) {
        this.view = view;
        this.directions = [
            {
                "direction":"To Dereham",
                "stop":"nfogjmpt"
            },
            {
                "direction":"To Norwich",
                "stop":"nfogjmta"
            }

        ];
        this.stopId = this.directions[0].stop;
    }

    BusDeparturesModel.stopId = null;

    BusDeparturesModel.data = null;

    BusDeparturesModel.prototype.hasData = function () {
        return !!this.data;
    };

    BusDeparturesModel.prototype.getDepartures = function () {
        return this.data
            .map(process)
            .filter(noMoreThan5)
    };

    BusDeparturesModel.prototype.getDirections = function () {
        return this.directions.map(function (obj) {
            return {
                direction:obj.direction,
                stop:obj.stop,
                className:obj.stop == this.stopId ? "selected" : ""
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

    yaxham.modules.BusDeparturesModel = BusDeparturesModel;

})();