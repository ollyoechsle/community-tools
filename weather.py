import common
import webapp2
import json
import logging
from google.appengine.api import memcache

config = {
    "APIKey": "a5b7c8f2-f1d0-44c5-a8bb-71d6d4e0892e",
    "hourlyForecastUrl": "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/%s?res=3hourly&key=%s",
    "dailyForecastUrl": "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/%s?res=daily&key=%s",
    "textForecastUrl": "http://datapoint.metoffice.gov.uk/public/data/txt/wxfcs/regionalforecast/json/%s?key=%s",
    "location": {
        "Dereham": "351196",
        "Norwich": "310115",
        "Swaffham": "324250",
        "KingsLynn": "352116"
    },
    "region": {
        "ee": "512",
        "uk": "515"
    }
}

def get_text_forecast(region_id):
    url = config["textForecastUrl"] % (region_id, config["APIKey"])
    logging.info("Calling url:  " + url)
    data = json.loads(common.get_data(url))
    first_period = data["RegionalFcst"]["FcstPeriods"]["Period"][0]
    return json.dumps(first_period)


def get_detailed_forecast(urlKey, location):
    url = config[urlKey] % (location, config["APIKey"])
    logging.info("Calling url:  " + url)
    return common.get_data(url)


def get_cached_detailed_forecast(urlKey, location):
    key = "detailed_forecast_" + urlKey + location
    data = memcache.get(key)

    if not data:
        data = get_detailed_forecast(urlKey, location)
        memcache.set(key, data, 86400)

    return data


def get_cached_text_forecast(location):
    key = "text_forecast_" + location
    data = memcache.get(key)

    if not data:
        data = get_text_forecast(location)
        memcache.set(key, data, 86400)

    return data


class HourlyForecastController(webapp2.RequestHandler):
    def get(self):
        location = self.request.get("location") or config["location"]["Dereham"]
        logging.info("Weather request for location:" + location)
        content = get_cached_detailed_forecast("hourlyForecastUrl", location)
        common.write_response(self.request, self.response, content)

class DailyForecastController(webapp2.RequestHandler):
    def get(self):
        location = self.request.get("location") or config["location"]["Dereham"]
        logging.info("Weather request for location:" + location)
        content = get_cached_detailed_forecast("dailyForecastUrl", location)
        common.write_response(self.request, self.response, content)

class TextForecastController(webapp2.RequestHandler):
    def get(self):
        region_id = self.request.get("region") or config["region"]["ee"]
        logging.info("Text forecast request for region:" + region_id)
        content = get_cached_text_forecast(region_id)
        common.write_response(self.request, self.response, content)

app = webapp2.WSGIApplication([
    ('/weather/hourly', HourlyForecastController),
    ('/weather/daily', DailyForecastController),
    ('/weather/text', TextForecastController)
], debug=True)
