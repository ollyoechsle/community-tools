import json
import common
import webapp2
import logging
import time
from google.appengine.api import urlfetch
from google.appengine.api import memcache
from datetime import datetime
import urllib
import urllib2
from xml.dom import minidom

config = {
    'top_level': "http://nextbus.mxdata.co.uk",
    'url': "http://nextbus.mxdata.co.uk/nextbuses/1.0/1",
    'username': "TravelineAPI138",
    'stop': "nfogjmpt",
    'password': "AeD6Otai"
}

def get_soap_request(stop):

    now = datetime.now()

    post = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Siri version="1.0" xmlns="http://www.siri.org.uk/">'
            '<ServiceRequest>'
            '<RequestTimestamp>%s</RequestTimestamp>'
            '<RequestorRef>%s</RequestorRef>'
            '<StopMonitoringRequest version="1.0">'
            '<RequestTimestamp>%s</RequestTimestamp>'
            '<MessageIdentifier>123</MessageIdentifier>'
            '<MonitoringRef>%s</MonitoringRef>'
            '</StopMonitoringRequest>'
            '</ServiceRequest>'
            '</Siri>')

    formatted = now.strftime('%Y-%m-%d %H:%M:%SZ')

    return (post % (formatted, config["username"], formatted, stop))

def get_buses_xml(stop):

    soap_request = get_soap_request(stop)

    # create a password manager
    password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()

    # Add the username and password.
    # If we knew the realm, we could use it instead of None.
    top_level_url = config["top_level"]
    password_mgr.add_password(None, top_level_url, config["username"], config["password"])

    handler = urllib2.HTTPBasicAuthHandler(password_mgr)

    # create "opener" (OpenerDirector instance)
    opener = urllib2.build_opener(handler)

    # use the opener to fetch a URL
    opener.open(config["url"])

    # Install the opener.
    # Now all calls to urllib2.urlopen use our opener.
    urllib2.install_opener(opener)

    logging.info(soap_request)
    req = urllib2.Request(config["url"], soap_request)
    #deadline=10
    response = urllib2.urlopen(req,None,30)
    return response.read()


def get_buses(stop):

    cache_id = "bus_request" + stop

    cached = memcache.get(cache_id)

    if cached:
        return cached
    else:
        cached = get_buses_xml(stop)

    memcache.set("buses", cache_id, 1200)
    return cached

def to_json(xml):

    xmldoc = minidom.parseString(xml)

    visits = xmldoc.getElementsByTagName("MonitoredStopVisit")

    ret = []

    for visit in visits:
        ret.append(to_object(visit))

    return ret

def to_object(item):
    return {
        "destination": common.getText(item, 'DirectionName'),
        "scheduled": common.getText(item, 'AimedDepartureTime'),
        "estimated": common.getText(item, 'ExpectedDepartureTime'),
        "service": common.getText(item, 'PublishedLineName'),
        "stop": common.getText(item, 'MonitoringRef'),
    }

class Buses(webapp2.RequestHandler):
    def get(self):

        stop = self.request.get("stop")
        logging.info("Request for stop:" + stop)

        if stop == "":
            logging.info("Using default stop")
            stop = config["stop"]

        content = to_json(get_buses(stop))
        common.write_response(self.request, self.response, json.dumps(content))

app = webapp2.WSGIApplication([('/buses', Buses)], debug=True)