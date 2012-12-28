(function (jQuery) {

    function WeatherChart(container) {
        this.jContainer = jQuery(container);
        this.initialise();
    }

    WeatherChart.prototype.jContainer = null;
    WeatherChart.prototype.ctx = null;

    WeatherChart.prototype.getCanvas = function () {

        var canvas = document.createElement("canvas");
        canvas.width = this.jContainer.width() || 160;
        canvas.height = this.jContainer.height() || 160;
        this.jContainer[0].appendChild(canvas);

        if (window.G_vmlCanvasManager) {
            return window.G_vmlCanvasManager.initElement(canvas);
        } else {
            return canvas;
        }
    };

    WeatherChart.prototype.initialise = function () {
        var canvas = this.getCanvas();
        this.ctx = canvas.getContext('2d');
    };

    WeatherChart.prototype.render = function (forecast) {

        var ctx = this.ctx,
            fw = 36,
            cx = 0;

        ctx.clearRect(0, 0, 500, 500);

        this.setStroke(WeatherChart.NOTCH);
        ctx.beginPath();
        ctx.moveTo(cx, forecast.top+2);
        for (var i = 0; i < 20 && i < forecast.length; i++) {
            ctx.lineTo(cx, forecast[i].top + 2);
            cx += fw;
        }
        ctx.stroke();

    };

    WeatherChart.prototype.setStroke = function (settings) {
        this.ctx.lineWidth = settings["stroke-width"];
        this.ctx.strokeStyle = settings["stroke"];
    };

    WeatherChart.NOTCH = {stroke: "#ccc", "stroke-width": 2};

    yaxham.modules.WeatherChart = WeatherChart;

})(window.jQuery);