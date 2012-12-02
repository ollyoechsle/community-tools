(function () {

    function WeatherModel(view) {
        this.view = view;
        this.locationIndex = 0;
        this.direction = "dereham";
    }

    WeatherModel.locationIndex = null;
    WeatherModel.direction = null;
    WeatherModel.data = null;

    WeatherModel.prototype.hasData = function () {
        return !!this.data;
    };

    WeatherModel.prototype.setAllData = function (json) {
        this.data = json;
        this.location = json.SiteRep.DV.Location;
    };

    var w = {
        "NA":{"Name":"Not Available", img:""},
        "0":{"Name":"Clear night", img:"01n.png"},
        "1":{"Name":"Sunny day", img:"01d.png"},
        "2":{"Name":"Partly cloudy", img:"01n.png"},
        "3":{"Name":"Partly cloudy", img:"01d.png"},
        "5":{"Name":"Mist", img:"15.png"},
        "6":{"Name":"Fog", img:"15.png"},
        "7":{"Name":"Cloudy", img:"04.png"},
        "8":{"Name":"Overcast", img:"04.png"},

        "9":{"Name":"Light rain shower", img:"05n.png"},
        "10":{"Name":"Light rain shower", img:"05d.png"},

        "11":{"Name":"Drizzle", img:"09.png"},
        "12":{"Name":"Light rain", img:"09.png"},

        "13":{"Name":"Heavy rain shower", img:"10.png"},
        "14":{"Name":"Heavy rain shower", img:"10.png"},
        "15":{"Name":"Heavy rain", img:"10.png"},

        "16":{"Name":"Sleet shower", img:"12.png"},
        "17":{"Name":"Sleet shower", img:"12.png"},
        "18":{"Name":"Sleet", img:"12.png"},

        "19":{"Name":"Hail shower", img:"08d.png"},
        "20":{"Name":"Hail shower", img:"08n.png"},
        "21":{"Name":"Hail", img:"08d.png"},

        "22":{"Name":"Light snow shower", img:"08d.png"},
        "23":{"Name":"Light snow shower", img:"08n.png"},
        "24":{"Name":"Light snow", img:"08d.png"},

        "25":{"Name":"Heavy snow shower", img:"13.png"},
        "26":{"Name":"Heavy snow shower", img:"13.png"},
        "27":{"Name":"Heavy snow", img:"13.png"},

        "28":{"Name":"Thunder shower", img:"11.png"},
        "29":{"Name":"Thunder shower", img:"11.png"},
        "30":{"Name":"Thunder", img:"11.png"}
    };

    yaxham.modules.WeatherModel = WeatherModel;

})();