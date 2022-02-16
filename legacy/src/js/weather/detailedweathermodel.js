(function () {

    function DetailedWeatherModel(path) {
        this.currentIndex = 0;
        this.path = path || "/weather/hourly"
    }

    DetailedWeatherModel.prototype = Object.create(Subscribable.prototype);

    DetailedWeatherModel.currentIndex = 0;
    DetailedWeatherModel.direction = null;
    DetailedWeatherModel.data = null;
    DetailedWeatherModel.path = null;

    DetailedWeatherModel.prototype.hasData = function () {
        return !!this.data;
    };

    DetailedWeatherModel.prototype.setAllData = function (json) {
        this.data = json;

        var periods = json.SiteRep.DV.Location.Period,
            allPeriods = [];

        periods.forEach(function (period) {
            var day = moment(period.value).format("ddd");
            for (var i = 0; i < period.Rep.length; i++) {
                period.Rep[i].day = day;
                allPeriods.push(period.Rep[i])
            }
        });

        this.allPeriods = allPeriods;
        this.fire("dataLoaded");
    };

    DetailedWeatherModel.prototype.changeCurrentIndex = function (delta) {
        this.currentIndex += delta;
        this.currentIndex = Math.max(0, this.currentIndex);
        this.currentIndex = Math.min(this.currentIndex, this.allPeriods.length - 1);
        this.fire("indexChanged");
    };

    DetailedWeatherModel.prototype.hasPrev = function () {
        return this.currentIndex > 0;
    };

    DetailedWeatherModel.prototype.hasNext = function () {
        return this.currentIndex < this.allPeriods.length - 1;
    };

    DetailedWeatherModel.prototype.getForecast = function () {
        var currentIndex = this.currentIndex;
        return this.allPeriods.map(function (reading, index) {
            return {
                className: index == currentIndex ? "current" : "notCurrent",
                type: DetailedWeatherModel.WEATHER[reading.W].name,
                icon: DetailedWeatherModel.WEATHER[reading.W].className,
                chanceOfRain: reading.Pp || reading.PPd || reading.PPn,
                temperature: reading.T || reading.Dm || reading.Nm,
                windSpeed: reading.S,
                timeOfDay: reading.$,
                windDirection: reading.D,
                time: DetailedWeatherModel.timeOfReading[reading.$],
                day: reading.day
            }
        });
    };

    DetailedWeatherModel.prototype.getTemperatureRange = function () {
        var temperatures = this.allPeriods.map(function (reading) {
            return reading.T
        });
        return {
            max: Math.max.apply(null, temperatures),
            min: Math.min.apply(null, temperatures)
        }
    };

    DetailedWeatherModel.timeOfReading = {
        "0": "0:00",
        "180": "03:00",
        "360": "06:00",
        "540": "09:00",
        "720": "12:00",
        "900": "15:00",
        "1080": "18:00",
        "1260": "21:00"
    };

    DetailedWeatherModel.WEATHER = {
        "NA": {"name": "Not Available", className: "notAvailable"},
        "0": {"name": "Clear", className: "clearNight"},
        "1": {"name": "Sunny", className: "clearDay"},
        "2": {"name": "Partly cloudy", className: "clearNight"},
        "3": {"name": "Partly cloudy", className: "clearDay"},
        "5": {"name": "Mist", className: "fogMist"},
        "6": {"name": "Fog", className: "fogMist"},
        "7": {"name": "Cloudy", className: "cloudy"},
        "8": {"name": "Overcast", className: "cloudy"},

        "9": {"name": "Light rain shower", className: "lightRainShowerNight"},
        "10": {"name": "Light rain shower", className: "lightRainShowerDay"},

        "11": {"name": "Drizzle", className: "lightRain"},
        "12": {"name": "Light rain", className: "lightRain"},

        "13": {"name": "Heavy rain shower", className: "heavyRain"},
        "14": {"name": "Heavy rain shower", className: "heavyRain"},
        "15": {"name": "Heavy rain", className: "heavyRain"},

        "16": {"name": "Sleet shower", className: "sleet"},
        "17": {"name": "Sleet shower", className: "sleet"},
        "18": {"name": "Sleet", className: "sleet"},

        "19": {"name": "Hail shower", className: "lightSnowDay"},
        "20": {"name": "Hail shower", className: "lightSnowNight"},
        "21": {"name": "Hail", className: "lightSnowDay"},

        "22": {"name": "Light snow shower", className: "lightSnowDay"},
        "23": {"name": "Light snow shower", className: "lightSnowNight"},
        "24": {"name": "Light snow", className: "lightSnowDay"},

        "25": {"name": "Heavy snow shower", className: "heavySnow"},
        "26": {"name": "Heavy snow shower", className: "heavySnow"},
        "27": {"name": "Heavy snow", className: "heavySnow"},

        "28": {"name": "Thunder shower", className: "thunderStorm"},
        "29": {"name": "Thunder shower", className: "thunderStorm"},
        "30": {"name": "Thunder", className: "thunderStorm"}
    };

    yaxham.modules.DetailedWeatherModel = DetailedWeatherModel;

})();