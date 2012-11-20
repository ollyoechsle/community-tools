(function () {

    function BusDeparturesModel(view) {
        this.view = view;
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
                         departureTime = moment(timestamp).add("m", delta),
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
                "delta":0
            },
            "norwich":{
                "NaptanCode":"nfogjmta",
                "CommonName":"Bus Shelter",
                "Landmark":"The Rosary",
                "Street":"Norwich Road",
                "Indicator":"opp",
                "LocalityName":"Yaxham",
                "Longitude":0.96461,
                "Latitude":52.65584
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
                "Latitude":52.65514
            },
            "norwich":{
                "NaptanCode":"nfogjmtg",
                "CommonName":"Elm Close",
                "Landmark":"St. Peters Close",
                "Street":"Norwich Road",
                "Indicator":"opp",
                "LocalityName":"Yaxham",
                "Longitude":0.9689,
                "Latitude":52.65518
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
                "Latitude":52.65877
            },
            "norwich":{
                "NaptanCode":"nfogjmpw",
                "CommonName":"Well Hill",
                "Landmark":"Well Hill",
                "Street":"Norwich Road",
                "Indicator":"opp",
                "LocalityName":"Clint Green",
                "Longitude":0.98935,
                "Latitude":52.65937
            }
        }

    ];

    yaxham.modules.BusDeparturesModel = BusDeparturesModel;

})();