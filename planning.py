import common
import webapp2
from google.appengine.api import urlfetch
import logging
import json
from BeautifulSoup import BeautifulSoup

def get_search_page(url):
    logging.info(url)
    result = urlfetch.fetch(url, headers = {'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17"})
    html = result.content
    soup = BeautifulSoup(html)
    params = {}
    for input in soup.findAll('input', {'type':'hidden'}):
        logging.info(input.get('name'))
        logging.info(input.get('value'))
        params[input.get('name')] = input.get('value')

    return params

class Planning(webapp2.RequestHandler):
    def get(self):
        content = get_search_page("http://planning.breckland.gov.uk/portal/page/portal/breckland/search")
        common.write_response(self.request, self.response, json.dumps(content))

app = webapp2.WSGIApplication([('/planning', Planning)], debug=True)