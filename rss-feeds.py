import json
import common
import webapp2
import logging
from xml.dom import minidom

def get_rss(url):
    xml = common.get_data(url)
    xmldoc = minidom.parseString(xml)
    foo = xmldoc.getElementsByTagName("item")
    return foo


class RSSFeeds(webapp2.RequestHandler):
    def get(self):
        content = get_rss("http://www.edp24.co.uk/cmlink/edp24_news_1_595700")
        common.write_response(self.response, content)


app = webapp2.WSGIApplication([('/rss-feeds', RSSFeeds)], debug=True)