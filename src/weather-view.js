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
        this.jBoard
            .empty()
            .addClass("loading");
    };

    WeatherView.prototype.displayBoard = function () {
        this.jBoard.html(Mustache.to_html(WeatherView.ROW, this.model.location.Period[0]));
    };

    WeatherView.prototype.destroy = function () {
    };

    WeatherView.ROW = '<tbody>' +
                      '{{#Rep}}' +
                      '<tr>' +
                      '<td>{{T}}</td>' +
                      '<td>{{W}}</td>' +
                      '<td>{{Pp}}</td>' +
                      '</tr>' +
                      '{{/Rep}}' +
                      '</tbody>';

    WeatherView.MARKUP = '' +
                         '<h2>Weather</h2>' +
                         '<table class="data"></table>';

    yaxham.modules.WeatherView = WeatherView;

})();