(function () {

    function TextForecastView(selector, model) {
        this.jElement = jQuery(selector);
        this.model = model;
        this.initialise();
    }

    TextForecastView.prototype = Object.create(Subscribable.prototype);

    TextForecastView.prototype.jElement = null;

    TextForecastView.prototype.initialise = function () {
        this.model.on("dataLoaded", this.updateAll, this);
    };

    TextForecastView.prototype.updateAll = function () {

        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }

    };

    TextForecastView.prototype.displayLoading = function () {
        this.jElement.empty().addClass("loading");
    };

    TextForecastView.prototype.displayBoard = function () {
        this.jElement.html(Mustache.to_html(TextForecastView.MARKUP, this.model.data));
    };

    TextForecastView.MARKUP = '' +
        '{{#Paragraph}}' +
        '<h3>{{title}}</h3>' +
        '<p>{{$}}</p>' +
        '{{/Paragraph}}';

    yaxham.modules.TextForecastView = TextForecastView;

})();