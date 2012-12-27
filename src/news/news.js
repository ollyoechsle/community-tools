(function () {

    yaxham.modules.News = function(element) {

        var model = new yaxham.modules.NewsModel(),
            view = new yaxham.modules.NewsView(element, model),
            controller = new yaxham.modules.NewsController(view, model);

        return controller;

    }

})();