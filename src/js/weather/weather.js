(function () {

    function getView(element, model) {
        if (element.hasClass("textForecast")) {
            return new yaxham.modules.TextForecastView(element, model)
        } else if (element.hasClass("horizontal")) {
            return new yaxham.modules.WeatherChartView(element, model)
        } else {
            return new yaxham.modules.WeatherView(element, model)
        }
    }

    function getModel(element) {
        if (element.hasClass("textForecast")) {
            return new yaxham.modules.TextForecastModel()
        } else {
            return new yaxham.modules.DetailedWeatherModel();
        }
    }

    yaxham.modules.Weather = function (selector) {

        jQuery(selector).each(function () {

            var jElement = jQuery(this),
                model = getModel(jElement),
                view = getView(jElement, model),
                controller = new yaxham.modules.WeatherController(view, model);

            controller.initialise();

        });

    }

})();