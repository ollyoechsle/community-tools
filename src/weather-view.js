(function () {

    function WeatherView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.initialise();
    }

    WeatherView.prototype = Object.create(Subscribable.prototype);

    WeatherView.prototype.jElement = null;

    WeatherView.prototype.initialise = function () {
        this.jElement
            .append(WeatherView.MARKUP)
            .delegate(".btn", "click.weather", this.handleNavigate.bind(this));
        this.model.on("indexChanged", this.updateAll, this);
    };

    WeatherView.prototype.handleNavigate = function(jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            direction = jTarget.data("direction");
        this.model.changeCurrentIndex(+direction);
    };

    WeatherView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    WeatherView.prototype.displayLoading = function () {
        this.jElement.find("currentConditions")
            .empty()
            .addClass("loading");
    };

    WeatherView.prototype.displayBoard = function () {

        var currentIndex = this.model.currentIndex,
            forecasts = this.model.getForecast(),
            currentConditions = forecasts[currentIndex],
            laterConditions = forecasts.filter(function(forecast, index) {
                return index >= currentIndex && index < (currentIndex + 4)
            });

        this.jElement.find(".currentConditions").html(
            Mustache.to_html(WeatherView.CURRENT_CONDITIONS, currentConditions)
            );

        this.jElement.find(".laterConditions").html(
            Mustache.to_html(WeatherView.LATER_CONDITIONS, {forecasts: laterConditions})
            );
    };

    WeatherView.prototype.destroy = function () {
        this.jElement.undelegate(".weather");
        this.model.un(null, this);
    };

    WeatherView.CURRENT_CONDITIONS = '' +
                                     '<img class="icon" src="img/weather/icons_120x100/{{icon}}"/>' +
                                     '<ul>' +
                                     '<li>' +
                                     '<div class="weatherType">{{type}}</div>' +
                                     '<div class="temperature">{{temperature}}&deg;C</div>' +
                                     '</li>' +
                                     '<li class="otherDetails">' +
                                     '<div class="heading">Rain</div>' +
                                     '<div class="rainChance reading">{{chanceOfRain}}%</div>' +
                                     '<div class="heading">Wind</div>' +
                                     '<div class="windSpeed reading">{{windSpeed}} mph {{windDirection}}</div>' +
                                     '</li>' +
                                     '</ul>';

    WeatherView.LATER_CONDITIONS = '<li class="btn prev" data-direction="-1"></li>' +
                                   '{{#forecasts}}' +
                                   '<li class="{{className}}">' +
                                   '<td><img width="60" height="50" src="/static/img/weather/icons_60x50/{{icon}}" /></td>' +
                                   '<div class="time heading">{{time}}</div>' +
                                   '<div class="temperature reading">{{temperature}}&deg;C</div>' +
                                   '</li>' +
                                   '{{/forecasts}}' +
                                   '<li class="btn next" data-direction="+1"></li>';

    WeatherView.MARKUP = '' +
                         '<div class="weather">' +
                         '<div class="currentConditions"></div>' +
                         '<ul class="laterConditions"></ul>' +
                         '<p class="attribution">Data: <a href="http://www.metoffice.gov.uk/public/weather/forecast/dereham">Met Office</a></p>' +
                         '</div>';

    yaxham.modules.WeatherView = WeatherView;

})();