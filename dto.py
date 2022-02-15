from dataclasses import dataclass
from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class NewsResponseDto:
    title: str
    description: str
    pubDate: str
    link: str
