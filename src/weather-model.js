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

    yaxham.modules.WeatherModel = WeatherModel;

})();