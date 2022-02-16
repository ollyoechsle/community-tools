from flask import jsonify, request
from flask import Flask, render_template, Response
from services.rss import get_rss
from services.buses import get_default_bus_service
from services.weather import get_weather_service, Resolution
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/news')
def news() -> Response:
    data = get_rss(
        "http://createfeed.fivefilters.org/extract.php?url=https%3A%2F%2Fwww.derehamtimes.co.uk%2F&item=.mdc-card__primary-action&item_title=.mdc-card__title")
    return jsonify(data)


@app.route('/weather/daily')
def daily_weather() -> Response:
    location = request.args.get("location")
    data = get_weather_service().get_location_forecast(location=int(location), resolution=Resolution.DAILY)
    return jsonify(data)


@app.route('/weather/hourly')
def hourly_weather() -> Response:
    location = request.args.get("location")
    data = get_weather_service().get_location_forecast(location=int(location), resolution=Resolution.HOURLY)
    return jsonify(data)


@app.route('/weather/text')
def text_weather() -> Response:
    region = request.args.get("region")
    data = get_weather_service().get_regional_text_forecast(region=int(region))
    return jsonify(data)


@app.route('/buses')
def buses() -> Response:
    stop_code = request.args.get("stops")
    data = get_default_bus_service().get_bus_departures(stop_code)
    return jsonify(data)


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
