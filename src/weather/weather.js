(function () {

    yaxham.modules.Weather = function(element) {

        var model = new yaxham.modules.WeatherModel(),
            view = new yaxham.modules.WeatherChartView(element, model),
            controller = new yaxham.modules.WeatherController(view, model);

        return controller;

    }

})();