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

config = {
    'top_level': "http://nextbus.mxdata.co.uk",
    'url': "http://nextbus.mxdata.co.uk/nextbuses/1.0/1",
    'username': "TravelineAPI138",
    'password': "AeD6Otai"
}

def get_soap_request(*arg):

    now = datetime.now()

    post = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Siri version="1.0" xmlns="http://www.siri.org.uk/">'
            '<ServiceRequest>'
            '<RequestTimestamp>%s</RequestTimestamp>'
            '<RequestorRef>%s</RequestorRef>'
            '<StopMonitoringRequest version="1.0">'
            '<RequestTimestamp>%s</RequestTimestamp>'
            '<MessageIdentifier>123</MessageIdentifier>'
            '<MonitoringRef>2900D1590</MonitoringRef>'
            '</StopMonitoringRequest>'
            '</ServiceRequest>'
            '</Siri>')

    formatted = now.strftime('%Y-%m-%d %H:%M:%SZ')

    return (post % (formatted, config["username"], formatted))

def get_buses_xml():

    soap_request = get_soap_request()

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


def get_buses():

    cached = memcache.get("buses")

    if cached:
        return cached
    else:
        cached = get_buses_xml()

    memcache.set("buses", cached, 300)
    return cached


class Buses(webapp2.RequestHandler):
    def get(self):

        content = get_buses()
        common.write_response(self.request, self.response, content)

app = webapp2.WSGIApplication([('/buses', Buses)], debug=True)