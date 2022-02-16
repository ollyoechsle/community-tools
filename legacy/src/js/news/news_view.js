(function () {

    function NewsView(selector, model) {
        this.jElement = jQuery(selector);
        if (this.jElement.length == 0) {
            throw new Error("Invalid selector: " + selector);
        }
        this.model = model;
        this.itemCount = 4;
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

        this.jElement.removeClass("loading");

        var data = this.model.getData(this.itemCount);

        this.jElement.html(
            Mustache.to_html(NewsView.NEWS_LIST, {
                items: data
            })
        );

        if (this.itemCount < this.model.data.length) {
            this.jElement.find(".showMore")
                .removeClass("hidden")
                .click(this.handleShowAllClicked.bind(this));
        }

    };

    NewsView.prototype.handleShowAllClicked = function () {
        this.itemCount += 5;
        this.updateAll();
    };

    NewsView.NEWS_LIST = '' +
        '<ul>' +
        '{{#items}}' +
        '<li class="{{className}}">' +
        '<h3><a target="_BLANK" href="{{link}}">{{title}}</a></h3>' +
        '<div>{{{description}}}</div>' +
        '<time datetime="{{pubDate}}">{{date}}</time>' +
        '</li>' +
        '{{/items}}' +
        '</ul>' +
        '<div class="showMore hidden button">More News..</div>';

    yaxham.modules.NewsView = NewsView;

})();