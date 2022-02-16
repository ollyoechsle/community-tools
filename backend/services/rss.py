from typing import List, Optional
from datetime import datetime

import requests
from xml.dom.minidom import parseString, Element

from legacy.dto import NewsResponseDto


def get_rss(url: str) -> List[NewsResponseDto]:
    xml = requests.get(url)
    print(xml.text)
    xmldoc = parseString(xml.text)
    xmlItems = xmldoc.getElementsByTagName("item")
    return [to_object(item) for item in xmlItems]


def getText(dom, tagName):
    elements = dom.getElementsByTagName(tagName)
    if len(elements) > 0 and len(elements[0].childNodes) > 0:
        return elements[0].childNodes[0].data
    else:
        return None


def to_object(item: Element) -> NewsResponseDto:
    return NewsResponseDto(
        title=getText(item, 'title'),
        description=getText(item, 'description'),
        pubDate=toISOTime(getText(item, 'pubDate')),
        link=getText(item, 'link')
    )


def toISOTime(text: str) -> Optional[str]:
    if not text:
        return None
    timeObj = datetime.strptime(text[:-6], "%a, %d %b %Y %H:%M:%S")
    formatted = datetime.strftime('%Y-%m-%dT%H:%M:%SZ', timeObj)
    return formatted
