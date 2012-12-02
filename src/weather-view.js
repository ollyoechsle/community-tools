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
    WeatherView.prototype.jBoard = null;

    WeatherView.prototype.initialise = function () {
        this.jElement.append(WeatherView.MARKUP);
        this.jBoard = this.jElement.find(".data");
    };

    WeatherView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    WeatherView.prototype.displayLoading = function () {
        this.jBoard.find("tbody")
            .empty()
            .addClass("loading");
    };

    WeatherView.prototype.displayBoard = function () {
        var forecasts = this.model.getForecast();
        this.jBoard.find("tbody").html(
            Mustache.to_html(WeatherView.ROW, {forecasts: forecasts})
            );
    };

    WeatherView.prototype.destroy = function () {
    };

    WeatherView.ROW = '{{#forecasts}}' +
                      '<tr>' +
                      '<td>{{type}}</td>' +
                      '<td><img src="/static/img/weather/icons_60x50/{{icon}}" /></td>' +
                      '<td>{{temperature}}&deg;C</td>' +
                      '<td>{{chanceOfRain}}</td>' +
                      '</tr>' +
                      '{{/forecasts}}';

    WeatherView.MARKUP = '' +
                         '<h2>Weather</h2>' +
                         '<table class="data">' +
                         '<thead>' +
                         '<tr><th>Type</th><th>Temp</th><th>Rain %</th></tr>' +
                         '</thead>' +
                         '<tbody></tbody>' +
                         '</table>';

    yaxham.modules.WeatherView = WeatherView;

})();