(function () {

    function NewsView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
    }

    NewsView.prototype = Object.create(Subscribable.prototype);

    NewsView.prototype.jElement = null;

    NewsView.prototype.updateAll = function () {
        if (this.model.hasData()) {
            this.displayBoard();
        } else {
            this.displayLoading();
        }
    };

    NewsView.prototype.displayLoading = function () {
        this.jElement.addClass("loading");
    };

    NewsView.prototype.displayBoard = function () {

        console.log("Displaying data: " + this.model.data.length);
        this.jElement.html(
            Mustache.to_html(NewsView.NEWS_LIST, {
                items: this.model.data
            })
        );

    };

    NewsView.NEWS_LIST = '' +
        '{{#items}}' +
        '<li class="{{className}}">' +
        '<a href="{{link}}">{{title}}</a>' +
        '<div>{{{description}}}</div>' +
        '</li>' +
        '{{/items}}';

    yaxham.modules.NewsView = NewsView;

})();