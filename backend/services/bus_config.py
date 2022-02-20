from typing import List

from services.bus_model import DirectionDefinition, StopDefinition

DIRECTIONS = [
    {
        "direction": "dereham",
        "label": "To Dereham"
    },
    {
        "direction": "norwich",
        "label": "To Norwich"
    }
]

LOCATIONS = [
    {
        "dereham": {
            "NaptanCode": "nfogpdjd",
            "CommonName": "Station Road",
            "Landmark": "",
            "Street": "Dereham Road",
            "Indicator": "adj",
            "LocalityName": "Yaxham",
            "Longitude": 0.96207,
            "Latitude": 52.65608,
            "delta": 0
        },
        "norwich": {
            "NaptanCode": "nfogmtdw",
            "CommonName": "Station Road",
            "Landmark": "Station Road",
            "Street": "Dereham Road",
            "Indicator": "opp",
            "LocalityName": "Yaxham",
            "Longitude": 0.96239,
            "Latitude": 52.65583,
            "delta": 0
        }
    },
    {
        "dereham": {
            "NaptanCode": "nfogjmpt",
            "CommonName": "Bus Shelter",
            "Landmark": "The Rosary",
            "Street": "Norwich Road",
            "Indicator": "adj",
            "LocalityName": "Yaxham",
            "Longitude": 0.96479,
            "Latitude": 52.6557,
            "delta": -30
        },
        "norwich": {
            "NaptanCode": "nfogjmta",
            "CommonName": "Bus Shelter",
            "Landmark": "The Rosary",
            "Street": "Norwich Road",
            "Indicator": "opp",
            "LocalityName": "Yaxham",
            "Longitude": 0.96461,
            "Latitude": 52.65584,
            "delta": 30
        }
    },
    {
        "dereham": {
            "NaptanCode": "nfogjmtj",
            "CommonName": "Elm Close",
            "Landmark": "Elm Close",
            "Street": "Norwich Road",
            "Indicator": "adj",
            "LocalityName": "Yaxham",
            "Longitude": 0.96829,
            "Latitude": 52.65514,
            "delta": -180
        },
        "norwich": {
            "NaptanCode": "nfogjmtg",
            "CommonName": "Elm Close",
            "Landmark": "St. Peters Close",
            "Street": "Norwich Road",
            "Indicator": "opp",
            "LocalityName": "Yaxham",
            "Longitude": 0.9689,
            "Latitude": 52.65518,
            "delta": 60
        }
    },
    {
        "dereham": {
            "NaptanCode": "nfogjmtd",
            "CommonName": "Well Hill",
            "Landmark": "Well Hill",
            "Street": "Norwich Road",
            "Indicator": "adj",
            "LocalityName": "Clint Green",
            "Longitude": 0.98847,
            "Latitude": 52.65877,
            "delta": -240
        },
        "norwich": {
            "NaptanCode": "nfogjmpw",
            "CommonName": "Well Hill",
            "Landmark": "Well Hill",
            "Street": "Norwich Road",
            "Indicator": "opp",
            "LocalityName": "Clint Green",
            "Longitude": 0.98935,
            "Latitude": 52.65937,
            "delta": 120
        }
    }
]


def get_stops(direction_id) -> List[StopDefinition]:
    for location in LOCATIONS:
        stop = location[direction_id]
        yield StopDefinition(
            id=stop["NaptanCode"],
            label=stop["CommonName"],
            indicator=stop["Indicator"],
            lat=stop["Latitude"],
            long=stop["Longitude"]
        )


def to_direction(dict) -> DirectionDefinition:
    return DirectionDefinition(
        id=dict["direction"],
        label=dict["label"],
        stops=list(get_stops(dict["direction"]))
    )


def convert(location: str) -> List[DirectionDefinition]:
    return [to_direction(direction) for direction in DIRECTIONS]


def get_directions():
    return [
        DirectionDefinition(id='dereham',
                            label='To Dereham',
                            stops=[
                                StopDefinition(id='nfogpdjd', label='Station Road', indicator='adj', lat=52.65608,
                                               long=0.96207),
                                StopDefinition(id='nfogjmpt', label='Bus Shelter', indicator='adj', lat=52.6557,
                                               long=0.96479),
                                StopDefinition(id='nfogjmtj', label='Elm Close', indicator='adj', lat=52.65514,
                                               long=0.96829),
                                StopDefinition(id='nfogjmtd', label='Well Hill', indicator='adj', lat=52.65877,
                                               long=0.98847)]
                            ),
        DirectionDefinition(id='norwich',
                            label='To Norwich',
                            stops=[
                                StopDefinition(id='nfogmtdw', label='Station Road', indicator='opp', lat=52.65583,
                                               long=0.96239),
                                StopDefinition(id='nfogjmta', label='Bus Shelter', indicator='opp', lat=52.65584,
                                               long=0.96461),
                                StopDefinition(id='nfogjmtg', label='Elm Close', indicator='opp', lat=52.65518,
                                               long=0.9689),
                                StopDefinition(id='nfogjmpw', label='Well Hill', indicator='opp', lat=52.65937,
                                               long=0.98935)]
                            )
    ]


if __name__ == '__main__':
    data = convert("yaxham")
    print(data)
