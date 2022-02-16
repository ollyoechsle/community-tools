import common
import webapp2


def get_tweets(url):
    json = common.get_cached_data(url)
    return json

class Twitter(webapp2.RequestHandler):
    def get(self):
        content = get_tweets("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=BreckCouncil")
        #content = get_tweets("https://api.twitter.com/1.1/search/tweets.json?q=from:BreckCouncil")
        common.write_response(self.request, self.response, content)

app = webapp2.WSGIApplication([('/twitter', Twitter)], debug=True)