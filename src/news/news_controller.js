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