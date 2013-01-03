import common
import webapp2
import json
import logging
from google.appengine.api import memcache

config = {
    "APIKey" : "a5b7c8f2-f1d0-44c5-a8bb-71d6d4e0892e",
    "url" : "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/%s?res=3hourly&key=%s",
    "location": {
        "Dereham":  "351196",
        "Norwich":  "310115",
        "Swaffham":  "324250",
        "KingsLynn":  "352116"
    }
}

def get_weather(location):
    url = config["url"] % (location, config["APIKey"])
    logging.info("Calling url:  " + url)
    return common.get_data(url)

def get_cached_weather(location):
    key = "weather_" + location
    data = memcache.get(key)

    if not data:
        data = get_weather(location)
        memcache.set(key, data, 86400)
    else:
        logging.info("Getting cached weather data")

    return data

class Weather(webapp2.RequestHandler):
    def get(self):

        location = self.request.get("location") or config["location"]["Dereham"]
        logging.info("Weather request for location:" + location)

        content = get_cached_weather(location);

        common.write_response(self.request, self.response, content)

app = webapp2.WSGIApplication([('/weather', Weather)], debug=True)