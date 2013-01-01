(function () {

    function getView(element, model) {
        if (element.hasClass("horizontal")) {
            return new yaxham.modules.WeatherChartView(element, model)
        } else {
            return new yaxham.modules.WeatherView(element, model)
        }
    }

    yaxham.modules.Weather = function (selector) {

        jQuery(selector).each(function () {

            var model = new yaxham.modules.WeatherModel(),
                view = getView(jQuery(this), model),
                controller = new yaxham.modules.WeatherController(view, model);

            controller.initialise();

        });

    }

})();