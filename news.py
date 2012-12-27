import json
import common
import webapp2
import logging
import time
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

class EDPRSSFeed(webapp2.RequestHandler):
    def get(self):
        content = get_rss("http://www.edp24.co.uk/cmlink/edp24_news_1_595700")
        common.write_response(self.request, self.response, json.dumps(content))

app = webapp2.WSGIApplication([('/news', EDPRSSFeed)], debug=True)