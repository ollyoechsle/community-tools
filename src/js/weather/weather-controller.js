(function () {

    function WeatherController(view, model) {
        this.intervals = [];
        this.view = view;
        this.model = model;
    }

    WeatherController.prototype.initialise = function () {
        this.load();
        this.intervals.push(setInterval(this.load.bind(this), 60000 * 5));
        this.view.updateAll();
    };

    WeatherController.prototype.load = function () {
        var data = {
            url:WeatherController.URL + "/weather",
            dataType:"jsonp"
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
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

    WeatherController.URL  = "http://community-tools.appspot.com";

    yaxham.modules.WeatherController = WeatherController;

})();