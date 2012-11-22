import common
import webapp2
import urllib
import urllib2
from google.appengine.api import urlfetch
import logging
import json
from BeautifulSoup import BeautifulSoup

user_agent_string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17"

def get_params(url):
    logging.info(url)

    result = urlfetch.fetch(url, headers = {'User-Agent': user_agent_string})

    cookie = result.headers.get('set-cookie', '')
    logging.info("Got cookie back from server")

    html = result.content
    soup = BeautifulSoup(html)
    params = {}
    for input in soup.findAll('input', {'type':'hidden'}):
        params[input.get('name')] = input.get('value')

    params["cookie"] = cookie

    return params

def fill_in_other_fields(params):

    params["p_object_name"] = "FORM_APPLICATION_SEARCH.DEFAULT.SUBMIT_TOP.01"
    params["p_event_type"] = "ON_CLICK"
    params["p_user_args"] = ""
    params["p_page_url"] = "http://planning.breckland.gov.uk/portal/page/portal/breckland/search"
    params["p_header"] = "false"
    params["p_instance"] = "1"

    params["FORM_APPLICATION_SEARCH.DEFAULT.PARISH.01"] = "113" # YAXHAM
    params["FORM_APPLICATION_SEARCH.DEFAULT.REFERENCE.01"]=""
    params["FORM_APPLICATION_SEARCH.DEFAULT.LOCATION.01"]=""
    params["FORM_APPLICATION_SEARCH.DEFAULT.POSTCODE.01"]=""
    params["FORM_APPLICATION_SEARCH.DEFAULT.APPLICANT.01"]=""

    return params

def do_search(form_fields):
    form_data = urllib.urlencode(form_fields)

    headers = {
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Charset':'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
        'Accept-Language':'en-US,en;q=0.8',
        'Cache-Control':'no-cache',
        'Connection':'keepalive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': form_fields["cookie"],
        'Origin':'http://planning.breckland.gov.uk',
        'Pragma':'no-cache',
        'Referer':'http://planning.breckland.gov.uk/portal/page/portal/breckland/search',
        'User-Agent': user_agent_string
    }

    logging.info("Headers: " + json.dumps(headers))

    result = urlfetch.fetch(url="http://planning.breckland.gov.uk/portal/pls/portal/!PORTAL.wwa_app_module.accept",
                            payload=form_data,
                            method=urlfetch.POST,
                            headers=headers)
    return result.content

class Planning(webapp2.RequestHandler):
    def get(self):
        params = get_params("http://planning.breckland.gov.uk/portal/page/portal/breckland/search")
        form_fields = fill_in_other_fields(params)
        common.write_html(self.request, self.response, do_search(form_fields))

app = webapp2.WSGIApplication([('/planning', Planning)], debug=True)
