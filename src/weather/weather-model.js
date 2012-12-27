(function () {

    function WeatherModel() {
        this.currentIndex = 0;
    }

    WeatherModel.prototype = Object.create(Subscribable.prototype);

    WeatherModel.currentIndex = 0;
    WeatherModel.direction = null;
    WeatherModel.data = null;

    WeatherModel.prototype.hasData = function () {
        return !!this.data;
    };

    WeatherModel.prototype.setAllData = function (json) {
        this.data = json;
        var periods = json.SiteRep.DV.Location.Period,
            allPeriods = [];
        periods.forEach(function (period) {
            Array.prototype.push.apply(allPeriods, period.Rep);
        });
        this.allPeriods = allPeriods;
    };

    WeatherModel.prototype.changeCurrentIndex = function (delta) {
        this.currentIndex += delta;
        this.currentIndex = Math.max(0, this.currentIndex);
        this.currentIndex = Math.min(this.currentIndex, this.allPeriods.length - 1);
        this.fire("indexChanged");
    };

    WeatherModel.prototype.hasPrev = function () {
        return this.currentIndex > 0;
    };

    WeatherModel.prototype.hasNext = function () {
        return this.currentIndex < this.allPeriods.length - 1;
    };

    WeatherModel.prototype.getForecast = function () {
        var currentIndex = this.currentIndex;
        return this.allPeriods.map(function (reading, index) {
            return {
                className: index == currentIndex ? "current" : "notCurrent",
                type:WeatherModel.WEATHER[reading.W].name,
                icon:WeatherModel.WEATHER[reading.W].img,
                chanceOfRain:reading.Pp,
                temperature:reading.T,
                windSpeed:reading.S,
                windDirection:reading.D,
                time:WeatherModel.timeOfReading[reading.$]
            }
        });
    };

    WeatherModel.timeOfReading = {
        "0":"0:00",
        "180":"03:00",
        "360":"06:00",
        "540":"09:00",
        "720":"12:00",
        "900":"15:00",
        "1080":"18:00",
        "1260":"21:00"
    };

    WeatherModel.WEATHER = {
        "NA":{"name":"Not Available", img:""},
        "0":{"name":"Clear", img:"01n.png"},
        "1":{"name":"Sunny", img:"01d.png"},
        "2":{"name":"Partly cloudy", img:"01n.png"},
        "3":{"name":"Partly cloudy", img:"01d.png"},
        "5":{"name":"Mist", img:"15.png"},
        "6":{"name":"Fog", img:"15.png"},
        "7":{"name":"Cloudy", img:"04.png"},
        "8":{"name":"Overcast", img:"04.png"},

        "9":{"name":"Light rain shower", img:"05n.png"},
        "10":{"name":"Light rain shower", img:"05d.png"},

        "11":{"name":"Drizzle", img:"09.png"},
        "12":{"name":"Light rain", img:"09.png"},

        "13":{"name":"Heavy rain shower", img:"10.png"},
        "14":{"name":"Heavy rain shower", img:"10.png"},
        "15":{"name":"Heavy rain", img:"10.png"},

        "16":{"name":"Sleet shower", img:"12.png"},
        "17":{"name":"Sleet shower", img:"12.png"},
        "18":{"name":"Sleet", img:"12.png"},

        "19":{"name":"Hail shower", img:"08d.png"},
        "20":{"name":"Hail shower", img:"08n.png"},
        "21":{"name":"Hail", img:"08d.png"},

        "22":{"name":"Light snow shower", img:"08d.png"},
        "23":{"name":"Light snow shower", img:"08n.png"},
        "24":{"name":"Light snow", img:"08d.png"},

        "25":{"name":"Heavy snow shower", img:"13.png"},
        "26":{"name":"Heavy snow shower", img:"13.png"},
        "27":{"name":"Heavy snow", img:"13.png"},

        "28":{"name":"Thunder shower", img:"11.png"},
        "29":{"name":"Thunder shower", img:"11.png"},
        "30":{"name":"Thunder", img:"11.png"}
    };

    yaxham.modules.WeatherModel = WeatherModel;

})();