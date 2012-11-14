import json
import webapp2
import logging

class RSSFeeds(webapp2.RequestHandler):
    def get(self):
        self.response.write("Hello, World")


app = webapp2.WSGIApplication([('/rss-feeds', RSSFeeds)], debug=True)