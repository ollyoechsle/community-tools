from typing import List
from xml.dom.minidom import Element

import requests
from datetime import datetime
from xml.dom import minidom

from requests.auth import HTTPBasicAuth

from exceptions.exceptions import ServerError
from services.bus_config import get_directions
from services.bus_model import BusDeparture, BusResponse

config = {
    'url': "http://nextbus.mxdata.co.uk/nextbuses/1.0/1",
    'username': "TravelineAPI138",
    'password': "AeD6Otai"
}


def get_default_bus_service():
    return BusService(
        hostname=config['url'],
        username=config['username'],
        password=config['password']
    )


def get_element_text(dom: Element, tag_name: str):
    elements = dom.getElementsByTagName(tag_name)
    if len(elements) > 0:
        return elements[0].childNodes[0].data
    else:
        return None


class BusService:
    hostname: str
    username: str
    password: str

    def __init__(self, hostname: str, username: str, password: str):
        self.hostname = hostname
        self.username = username
        self.password = password

    def get_soap_request(self, stop: str) -> str:
        request_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%SZ')
        request_xml = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                       f'<Siri version="1.0" xmlns="http://www.siri.org.uk/">'
                       f'<ServiceRequest>'
                       f'<RequestTimestamp>{request_timestamp}</RequestTimestamp>'
                       f'<RequestorRef>{self.username}</RequestorRef>'
                       f'<StopMonitoringRequest version="1.0">'
                       f'<RequestTimestamp>{request_timestamp}</RequestTimestamp>'
                       f'<MessageIdentifier>123456</MessageIdentifier>'
                       f'<MonitoringRef>{stop}</MonitoringRef>'
                       f'</StopMonitoringRequest>'
                       f'</ServiceRequest>'
                       f'</Siri>')
        return request_xml

    def get_bus_departures(self, stop) -> BusResponse:
        assert stop is not None
        soap_request = self.get_soap_request(stop)
        response = requests.post(url='http://nextbus.mxdata.co.uk/nextbuses/1.0/1',
                                 data=soap_request,
                                 timeout=10,
                                 auth=HTTPBasicAuth(self.username, self.password))
        if response.status_code == 200:
            return BusResponse(
                directions=get_directions(),
                departures=self.convert_xml(xml=response.text)
            )
        else:
            raise ServerError(message=f"Failed to get bus departures. Server returned code {response.status_code}",
                              http_code=500)

    def convert_xml(self, xml: str) -> List[BusDeparture]:
        xmldoc = minidom.parseString(xml)

        visits = xmldoc.getElementsByTagName("MonitoredStopVisit")

        return [self.to_departure(visit) for visit in visits]

    def to_departure(self, item) -> BusDeparture:
        return BusDeparture(
            destination=get_element_text(item, 'DirectionName'),
            scheduled=get_element_text(item, 'AimedDepartureTime'),
            estimated=get_element_text(item, 'ExpectedDepartureTime'),
            service=get_element_text(item, 'PublishedLineName'),
            stop=get_element_text(item, 'MonitoringRef'),
        )