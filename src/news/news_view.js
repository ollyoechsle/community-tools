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
                items: this.model.getData()
            })
        );

    };

    NewsView.NEWS_LIST = '' +
        '<ul>' +
        '{{#items}}' +
        '<li class="{{className}}">' +
        '<a target="_BLANK" href="{{link}}">{{title}}</a> ' +
        '<div>{{{description}}}</div>' +
        '<time datetime="{{pubDate}}">{{date}}</time>' +
        '</li>' +
        '{{/items}}' +
        '</ul>';

    yaxham.modules.NewsView = NewsView;

})();