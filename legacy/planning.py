import common
import webapp2
import urllib, Cookie
from google.appengine.api import urlfetch
import logging
import time
from BeautifulSoup import BeautifulSoup


class URLOpener:
    def __init__(self):
        self.cookie = Cookie.SimpleCookie()

    def open(self, url, data=None):
        if data is None:
            headers = self._getHeaders(self.cookie)
            method = urlfetch.GET
        else:
            headers = self._getHeaders(self.cookie)
            headers["Content-Type"] = "application/x-www-form-urlencoded"
            logging.info(data)
            logging.info(headers)
            method = urlfetch.POST

        while url is not None:
            logging.info("Getting %s" % url)
            response = urlfetch.fetch(
                url=url,
                payload=data,
                method=method,
                headers=headers,
                allow_truncated=False,
                follow_redirects=False,
                deadline=10,
            )
            data = (
                None  # Next request will be a get, so no need to send the data again.
            )
            method = urlfetch.GET
            set_cookie = response.headers.get("set-cookie", "")
            logging.info("Set cookie string %s" % set_cookie)
            self.cookie.load(set_cookie)  # Load the cookies from the response
            url = response.headers.get("location")

        return response

    def _getHeaders(self, cookie):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)",
            "Cookie": self._makeCookieHeader(cookie),
        }
        return headers

    def _makeCookieHeader(self, cookie):
        cookieHeader = ""
        for value in cookie.values():
            cookieHeader += "%s=%s; " % (value.key, value.value)
        logging.info("Cookie: %s" % cookieHeader)
        return cookieHeader


def get_params(opener, url):

    response = opener.open(url)

    html = response.content
    soup = BeautifulSoup(html)
    params = {}
    for input in soup.findAll("input", {"type": "hidden"}):
        params[input.get("name")] = input.get("value")

    return params


def fill_in_other_fields(params):

    params["p_object_name"] = "FORM_APPLICATION_SEARCH.DEFAULT.SUBMIT_TOP.01"
    params["p_event_type"] = "ON_CLICK"
    params["p_user_args"] = ""
    params[
        "p_page_url"
    ] = "http://planning.breckland.gov.uk/portal/page/portal/breckland/search"
    params["p_header"] = "false"
    params["p_instance"] = "1"

    params["FORM_APPLICATION_SEARCH.DEFAULT.PARISH.01"] = "113"  # YAXHAM
    params["FORM_APPLICATION_SEARCH.DEFAULT.REFERENCE.01"] = ""
    params["FORM_APPLICATION_SEARCH.DEFAULT.LOCATION.01"] = ""
    params["FORM_APPLICATION_SEARCH.DEFAULT.POSTCODE.01"] = ""
    params["FORM_APPLICATION_SEARCH.DEFAULT.APPLICANT.01"] = ""

    return params


def do_search(opener, form_fields):
    form_data = urllib.urlencode(form_fields)
    response = opener.open(
        "http://planning.breckland.gov.uk/portal/pls/portal/!PORTAL.wwa_app_module.accept",
        form_data,
    )
    return response.content


class Planning(webapp2.RequestHandler):
    def get(self):
        opener = URLOpener()
        params = get_params(
            opener,
            "http://planning.breckland.gov.uk/portal/page/portal/breckland/search",
        )
        form_fields = fill_in_other_fields(params)

        logging.info("Waiting for 15 seconds")
        time.sleep(15)

        common.write_html(self.request, self.response, do_search(opener, form_fields))


app = webapp2.WSGIApplication([("/planning", Planning)], debug=True)
