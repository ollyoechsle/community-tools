(function () {

    function NewsView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.showAll = false;
    }

    NewsView.prototype.jElement = null;
    NewsView.prototype.showAll = null;

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

        var data = this.model.getData(!this.showAll ? 5 : 10);

        this.jElement.html(
            Mustache.to_html(NewsView.NEWS_LIST, {
                items: data
            })
        );

        if (!this.showAll) {
            this.jElement.find(".showMore")
                .removeClass("hidden")
                .click(this.handleShowAllClicked.bind(this));
        }

    };

    NewsView.prototype.handleShowAllClicked = function () {
        this.showAll = true;
        this.updateAll();
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
        '</ul>' +
        '<div class="showMore hidden button">Show More Items</div>';

    yaxham.modules.NewsView = NewsView;

})();