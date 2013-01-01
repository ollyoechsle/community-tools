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