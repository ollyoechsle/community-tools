/* Community Tools 1.0 */

console.log("Welcome to Yaxham!");
/**@namespace*/
window.yaxham = window.yaxham || {};
/**@namespace*/
window.yaxham.modules = window.yaxham.modules || {};
(function () {

    yaxham.modules.News = function(element) {

        var model = new yaxham.modules.NewsModel(),
            view = new yaxham.modules.NewsView(element, model),
            controller = new yaxham.modules.NewsController(view, model);

        return controller;

    }

})();
(function () {

    function NewsController(view, model) {
        this.intervals = [];
        this.view = view;
        this.model = model;
    }

    NewsController.prototype.initialise = function () {
        this.load();
        this.view.updateAll();
    };

    NewsController.prototype.load = function () {
        var data = {
            url:NewsController.URL,
            dataType:"jsonp"
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
    };

    NewsController.prototype.handleLoad = function (data) {
        this.model.setAllData(data);
        this.view.updateAll();
    };

    NewsController.prototype.destroy = function () {
        this.intervals.forEach(function (interval) {
            window.clearInterval(interval);
        });
        this.view.destroy();
    };

    NewsController.URL = "http://community-tools.appspot.com/news";

    yaxham.modules.NewsController = NewsController;

})();
(function () {

    function NewsModel() {
        this.data = null;
    }

    NewsModel.prototype.data = null;

    NewsModel.prototype.hasData = function () {
        return !!this.data;
    };

    NewsModel.prototype.setAllData = function (json) {
        this.data = json;
    };

    NewsModel.prototype.getData = function (numItems) {
        var formatStr = "ddd HH:mm";
        return this.data
            .filter(function noMoreThan(val, i) {
                return i < numItems;
            })
            .map(function (item) {
                return {
                    title: item.title,
                    pubDate: item.pubDate,
                    date: moment(item.pubDate).format(formatStr),
                    description: item.description,
                    link: item.link
                }
            })
    };

    yaxham.modules.NewsModel = NewsModel;

})();
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