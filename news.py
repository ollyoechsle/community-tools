import json
import common
import webapp2
import logging
import time
from xml.dom import minidom

def get_rss(url):
    xml = common.get_data(url)
    xmldoc = minidom.parseString(xml)
    items = []
    xmlItems = xmldoc.getElementsByTagName("item")
    for item in xmlItems:
        items.append(to_object(item))
    return items

def to_object(item):
    return {
        "title": getText(item, 'title'),
        "description": getText(item, 'description'),
        "pubDate": toISOTime(getText(item, 'pubDate')),
        "link": getText(item, 'link')
    }

def toISOTime(text):
    timeObj = time.strptime(text[:-6], "%a, %d %b %Y %H:%M:%S")
    formatted = time.strftime('%Y-%m-%d %H:%M:%SZ', timeObj)
    return formatted

def getText(dom, tagName):
    return dom.getElementsByTagName(tagName)[0].childNodes[0].data

class EDPRSSFeed(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        content = get_rss("http://www.edp24.co.uk/cmlink/edp24_news_1_595700")
        common.write_response(self.response, json.dumps(content))


app = webapp2.WSGIApplication([('/news', EDPRSSFeed)], debug=True)