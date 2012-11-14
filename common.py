from google.appengine.api import urlfetch
from google.appengine.api import memcache

config = {
    'cacheLength': 90 #seconds
}

class NotFoundError(Exception):
    pass


class InvalidPathError(Exception):
    pass

def get_data(url):
    result = urlfetch.fetch(url)
    return result.content

def write_response(response, content):
    response.headers['Content-Type'] = 'text/javascript'
    response.out.write(content)