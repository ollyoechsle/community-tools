(function () {

    function BusDeparturesController(view, model) {
        this.intervals = [];
        this.view = view;
        this.model = model;
    }

    BusDeparturesController.prototype.initialise = function () {
        this.load();
        // update the board every 10 seconds
        this.intervals.push(setInterval(this.view.updateAll.bind(this.view), 10000));
        // retrieve more data from the server every 5 minutes
        this.intervals.push(setInterval(this.load.bind(this), 60000 * 5));
        this.view.updateAll();
        this.view.on("directionChanged", this.handleDirectionChanged.bind(this));
    };

    BusDeparturesController.prototype.handleDirectionChanged = function (newDirection) {
        this.model.data = null;
        this.model.direction = newDirection;
        this.load();
        this.view.updateAll();
    };

    BusDeparturesController.prototype.load = function () {
        console.log("Loading data from " + BusDeparturesController.URL);
        var data = {
            url:BusDeparturesController.URL,
            dataType:"jsonp",
            data:{
                stop:this.model.getStop().NaptanCode
            }
        };
        var promise = jQuery.ajax(data);
        promise.then(this.handleLoad.bind(this));
    };

    BusDeparturesController.prototype.handleLoad = function (data) {
        console.log("Finished loading");
        this.model.data = data;
        this.view.updateAll();
    };

    BusDeparturesController.prototype.destroy = function () {
        this.intervals.forEach(function (interval) {
            window.clearInterval(interval);
        });
        this.view.destroy();
    };

    BusDeparturesController.URL = "http://community-tools.appspot.com/buses";

    yaxham.modules.BusDeparturesController = BusDeparturesController;

})();