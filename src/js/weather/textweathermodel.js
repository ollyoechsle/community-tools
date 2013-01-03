(function () {

    function TextForecastModel() {
        this.path = "/weather/text"
    }

    TextForecastModel.prototype = Object.create(Subscribable.prototype);
    TextForecastModel.data = null;

    TextForecastModel.prototype.hasData = function () {
        return !!this.data;
    };

    TextForecastModel.prototype.setAllData = function (json) {
        this.data = json;
        this.fire("dataLoaded");
    };

    yaxham.modules.TextForecastModel = TextForecastModel;

})();