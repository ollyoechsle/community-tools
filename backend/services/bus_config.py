from services.bus_model import DirectionDefinition, StopDefinition

CONFIG = {
    "yaxham": [
        DirectionDefinition(
            id="dereham",
            label="To Dereham",
            stops=[
                StopDefinition(
                    id="nfogpdjd",
                    label="Station Road",
                    indicator="adj",
                    lat=52.65608,
                    long=0.96207,
                ),
                StopDefinition(
                    id="nfogjmpt",
                    label="Bus Shelter",
                    indicator="adj",
                    lat=52.6557,
                    long=0.96479,
                ),
                StopDefinition(
                    id="nfogjmtj",
                    label="Elm Close",
                    indicator="adj",
                    lat=52.65514,
                    long=0.96829,
                ),
                StopDefinition(
                    id="nfogjmtd",
                    label="Well Hill",
                    indicator="adj",
                    lat=52.65877,
                    long=0.98847,
                ),
            ],
        ),
        DirectionDefinition(
            id="norwich",
            label="To Norwich",
            stops=[
                StopDefinition(
                    id="nfogmtdw",
                    label="Station Road",
                    indicator="opp",
                    lat=52.65583,
                    long=0.96239,
                ),
                StopDefinition(
                    id="nfogjmta",
                    label="Bus Shelter",
                    indicator="opp",
                    lat=52.65584,
                    long=0.96461,
                ),
                StopDefinition(
                    id="nfogjmtg",
                    label="Elm Close",
                    indicator="opp",
                    lat=52.65518,
                    long=0.9689,
                ),
                StopDefinition(
                    id="nfogjmpw",
                    label="Well Hill",
                    indicator="opp",
                    lat=52.65937,
                    long=0.98935,
                ),
            ],
        ),
    ]
}


def get_directions(location: str):
    return CONFIG[location] if location in CONFIG else None
