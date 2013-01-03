(function () {

    function WeatherController(view, model) {
        this.intervals = [];
        this.view = view;
        this.model = model;
    }

    WeatherController.prototype.initialise = function () {
        this.loadDetailedForecast();
        this.intervals.push(setInterval(this.loadDetailedForecast.bind(this), 60000 * 5));
        this.view.updateAll();
    };

    WeatherController.prototype.loadDetailedForecast = function () {
        jQuery.ajax({
            url: WeatherController.URL + this.model.path,
            dataType: "jsonp"
        }).then(this.handleLoad.bind(this));
    };

    WeatherController.prototype.handleLoad = function (data) {
        this.model.setAllData(data);
        this.view.updateAll();
    };

    WeatherController.prototype.destroy = function () {
        this.intervals.forEach(function (interval) {
            window.clearInterval(interval);
        });
        this.view.destroy();
    };

    WeatherController.URL = "http://community-tools.appspot.com";

    yaxham.modules.WeatherController = WeatherController;

})();