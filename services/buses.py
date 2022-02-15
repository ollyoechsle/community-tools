from dataclasses import dataclass
from typing import List

import requests
from datetime import datetime
from xml.dom import minidom

from requests.auth import HTTPBasicAuth

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

stops = {
    "Yaxham_Road": "NFOAMTMG"
}


@dataclass
class BusDeparture:
    destination: str
    scheduled: str
    estimated: str
    service: str
    stop: str


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

    def get_bus_departures(self, stop) -> List[BusDeparture]:
        soap_request = self.get_soap_request(stop)
        response = requests.post(url='http://nextbus.mxdata.co.uk/nextbuses/1.0/1',
                                 data=soap_request,
                                 timeout=10,
                                 auth=HTTPBasicAuth(self.username, self.password))
        return self.to_json(response.text)

    def to_json(self, xml: str) -> List[BusDeparture]:
        xmldoc = minidom.parseString(xml)

        visits = xmldoc.getElementsByTagName("MonitoredStopVisit")

        return [self.to_object(visit) for visit in visits]

    def to_object(self, item) -> BusDeparture:
        return BusDeparture(
            destination=item['DirectionName'],
            scheduled=item['AimedDepartureTime'],
            estimated=item['ExpectedDepartureTime'],
            service=item['PublishedLineName'],
            stop=item['MonitoringRef'],
        )


if __name__ == '__main__':
    service = get_default_bus_service()
    response = service.get_bus_departures(stop=stops["Yaxham_Road"])
    print(response)
