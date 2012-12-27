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

    yaxham.modules.NewsModel = NewsModel;

})();