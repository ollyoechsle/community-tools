from dataclasses import dataclass
from typing import List, Optional


@dataclass
class StopDefinition:
    id: str
    label: str
    indicator: str
    lat: Optional[float]
    long: Optional[float]


@dataclass
class DirectionDefinition:
    id: str
    label: str
    stops: List[StopDefinition]


@dataclass
class BusDeparture:
    destination: str
    scheduled: str
    estimated: str
    service: str
    stop: str


@dataclass
class BusResponse:
    directions: List[DirectionDefinition]
    departures: List[BusDeparture]
