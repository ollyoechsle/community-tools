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

def getText(dom, tagName):
    elements = dom.getElementsByTagName(tagName);
    if len(elements) > 0:
        return elements[0].childNodes[0].data
    else:
        return None

def get_cached_data(url):
    cached = memcache.get(url)

    if cached:
        return cached
    else:
        cached = get_data(url)

    memcache.set(url, cached, config['cacheLength'])
    return cached

def write_response(request, response, content):
    callback = request.get('callback')
    if callback:
        response.headers['Content-Type'] = 'text/javascript'
        response.out.write("%s(%s)" % (callback, content))
    else:
        response.headers['Content-Type'] = 'application/json'
        response.out.write(content)

def write_html(request, response, content):
    response.headers['Content-Type'] = 'text/html'
    response.out.write(content)
