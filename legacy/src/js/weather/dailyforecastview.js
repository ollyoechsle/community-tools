(function () {

    function DailyForecastView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.initialise();
    }

    DailyForecastView.prototype = Object.create(Subscribable.prototype);

    DailyForecastView.prototype.jElement = null;

    DailyForecastView.prototype.initialise = function () {
        this.model.on("dataLoaded", this.updateAll, this);
    };

    DailyForecastView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    DailyForecastView.prototype.displayLoading = function () {
        this.jElement.empty().addClass("loading");
    };

    DailyForecastView.prototype.displayBoard = function () {

        var forecasts = this.model.getForecast();

        this.jElement.removeClass("loading");

        this.jElement.html(
            Mustache.to_html(DailyForecastView.LIST, {
                list: forecasts
            })
        );
    };

    DailyForecastView.prototype.destroy = function () {
        this.model.un(null, this);
    };

    /**
     * @type {String}
     */
    DailyForecastView.LIST = '' +
        '<table class="table weather">'
        + '<thead>'
        + '<tr>'
        + '<th>Day</th>'
        + '<th></th>'
        + '<th class="numeric">Temp.</th>'
        + '<th class="numeric">Wind</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>' +
        '{{#list}}' +
        '<tr">' +
        '<td>' +
        '{{day}}' +
        '<small>{{timeOfDay}}</small>' +
        '</td>' +
        '<td><div class="icon {{icon}}"></div></td>' +
        '<td class="numeric">{{temperature}} &deg;C</td>' +
        '<td class="numeric"><div class="wind {{windDirection}}">{{windSpeed}}</div></td>' +
        '</tr>' +
        '{{/list}}' +
        '</tbody>' +
        '</table>';

    yaxham.modules.DailyForecastView = DailyForecastView;

})();