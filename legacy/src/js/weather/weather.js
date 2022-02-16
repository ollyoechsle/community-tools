(function () {

    function getView(element, model) {
        if (element.hasClass("textForecast")) {
            return new yaxham.modules.TextForecastView(element, model)
        } else if (element.hasClass("daily")) {
            return new yaxham.modules.DailyForecastView(element, model)
        } else {
            return new yaxham.modules.WeatherChartView(element, model)
        }
    }

    function getModel(element) {
        if (element.hasClass("textForecast")) {
            return new yaxham.modules.TextForecastModel()
        } else {
            if (element.hasClass("daily")) {
                return new yaxham.modules.DetailedWeatherModel("/weather/daily");
            } else {
                return new yaxham.modules.DetailedWeatherModel("/weather/hourly");
            }
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