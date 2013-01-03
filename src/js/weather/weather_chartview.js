(function () {

    function WeatherChartView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.initialise();
    }

    WeatherChartView.prototype = Object.create(Subscribable.prototype);

    WeatherChartView.prototype.jElement = null;

    WeatherChartView.prototype.initialise = function () {

        this.jElement
            .append(WeatherChartView.MARKUP)
            .delegate(".btn", "click.weather", this.handleNavigate.bind(this));
        this.weatherChart = new yaxham.modules.WeatherChart(this.jElement.find(".navigator"));

        this.numItems = Math.max(5, this.jElement.width() / 36);
        this.model.on("indexChanged", this.updateAll, this);
    };

    WeatherChartView.prototype.handleNavigate = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            direction = jTarget.data("direction");
        this.model.changeCurrentIndex(+direction);
    };

    WeatherChartView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    WeatherChartView.prototype.displayLoading = function () {
        this.jElement.find("currentConditions")
            .empty()
            .addClass("loading");
    };

    WeatherChartView.prototype.displayBoard = function () {

        var numItems = this.numItems,
            currentIndex = this.model.currentIndex,
            forecasts = this.model.getForecast().filter(function (forecast, index) {
                return index >= currentIndex && index < (currentIndex + numItems)
            }),
            temperatureRange = this.model.getTemperatureRange(),
            range = temperatureRange.max - temperatureRange.min;

        forecasts.forEach(function (forecast) {
            var pc = ((forecast.temperature - temperatureRange.min) / range) * 50;
            forecast.top = 50 - pc;
            forecast.className = forecast.time == "0:00" ? "startOfDay" : ""
            forecast.time = forecast.time == "0:00" ? forecast.day + "<br>" + forecast.time : "<br>" + forecast.time;
        });


        this.weatherChart.render(forecasts);

        this.jElement.find(".laterConditions").html(
            Mustache.to_html(WeatherChartView.LATER_CONDITIONS, {forecasts: forecasts})
        );
    };

    WeatherChartView.prototype.destroy = function () {
        this.jElement.undelegate(".weather");
        this.model.un(null, this);
    };

    WeatherChartView.LATER_CONDITIONS = '' +
        '{{#forecasts}}' +
        '<li class="{{className}}">' +
        '<div class="time heading">{{{time}}}</div>' +
        '<div class="precipitation" style="height: {{chanceOfRain}}px"></div>' +
        '<div class="fc" style="top: {{top}}px">' +
        '<div class="icon {{icon}}" title="{{type}}"></div>' +
        '<div class="temperature reading">{{temperature}}&deg;C</div>' +
        '</div>' +
        '</li>' +
        '{{/forecasts}}';

    WeatherChartView.MARKUP = '' +
        '<div class="weather horizontal">' +
        '<div class="navigator">' +
        '<div class="btn prev" data-direction="-1"></div>' +
        '<ul class="laterConditions"></ul>' +
        '<div class="btn next" data-direction="+1"></div>' +
        '</div>' +
        '<p class="attribution">Data: <a href="http://www.metoffice.gov.uk/public/weather/forecast/dereham">Met Office</a></p>' +
        '</div>';

    yaxham.modules.WeatherChartView = WeatherChartView;

})();