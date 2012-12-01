import common
import webapp2
import json
import logging

config = {
    "APIKey" : "a5b7c8f2-f1d0-44c5-a8bb-71d6d4e0892e",
    "url" : "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/%s?res=3hourly&key=%s"
}

#<Location id="351196" latitude="52.6813" longitude="0.9396" name="Dereham"/>
#<Location id="310115" latitude="52.6305" longitude="1.2991" name="Norwich"/>
#<Location id="324250" latitude="52.6471" longitude="0.6892" name="Swaffham"/>
#<Location id="352116" latitude="52.7511" longitude="0.3989" name="King's Lynn Youth Hostel"/>

def get_weather(location):
    url = config["url"] % (location, config["APIKey"])
    logging.info("Calling url:  " + url)
    return common.get_data(url)

class Weather(webapp2.RequestHandler):
    def get(self):

        location = self.request.get("location") or "351196"
        logging.info("Weather request for location:" + location)

        content = get_weather(location);
        common.write_response(self.request, self.response, content)

app = webapp2.WSGIApplication([('/weather', Weather)], debug=True)