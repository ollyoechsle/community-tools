import json
import common
import webapp2
import logging
import time
from google.appengine.api import memcache
from xml.dom import minidom

def get_rss(url):
    xml = common.get_cached_data(url)
    xmldoc = minidom.parseString(xml)
    items = []
    xmlItems = xmldoc.getElementsByTagName("item")
    for item in xmlItems:
        items.append(to_object(item))
    return items

def to_object(item):
    return {
        "title": common.getText(item, 'title'),
        "description": common.getText(item, 'description'),
        "pubDate": toISOTime(common.getText(item, 'pubDate')),
        "link": common.getText(item, 'link')
    }

def toISOTime(text):
    timeObj = time.strptime(text[:-6], "%a, %d %b %Y %H:%M:%S")
    formatted = time.strftime('%Y-%m-%dT%H:%M:%SZ', timeObj)
    return formatted

def get_news():
    cache_id = "edpnews"
    cached = memcache.get(cache_id)
    if cached:
        return cached
    else:
        cached = get_rss("http://createfeed.fivefilters.org/extract.php?url=https%3A%2F%2Fwww.derehamtimes.co.uk%2F&item=.mdc-card__primary-action&item_title=.mdc-card__title")
        memcache.set(cache_id, cached, time=3600)
        return cached

class EDPRSSFeed(webapp2.RequestHandler):
    def get(self):
        news = get_news()
        common.write_response(self.request, self.response, json.dumps(news))

app = webapp2.WSGIApplication([('/news', EDPRSSFeed)], debug=True)