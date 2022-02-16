from dataclasses import dataclass
from enum import Enum
from typing import List, Dict

import requests

import json


# config = {
#     "APIKey": ,
#     "hourlyForecastUrl": "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/%s?res=3hourly&key=%s",
#     "dailyForecastUrl": "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/%s?res=daily&key=%s",
#     "textForecastUrl": "http://datapoint.metoffice.gov.uk/public/data/txt/wxfcs/regionalforecast/json/%s?key=%s",

#     "region": {
#         "ee": "512",
#         "uk": "515"
#     }
# }

def get_weather_service():
    return WeatherService(
        api_key="a5b7c8f2-f1d0-44c5-a8bb-71d6d4e0892e",
        hostname="http://datapoint.metoffice.gov.uk"
    )


class Resolution(Enum):
    HOURLY = 1
    DAILY = 2


class Region(Enum):
    EASTERN_ENGLAND = 512
    UK = 515


class Location(Enum):
    DEREHAM = 351196
    NORWICH = 310115
    SWAFFHAM = 324250
    KINGS_LYNN = 352116


def get_resolution_param(resolution: Resolution) -> str:
    if resolution == resolution.DAILY:
        return "daily"
    elif resolution == resolution.HOURLY:
        return "3hourly"
    raise Exception(f"Unknown resolution: {resolution}")


@dataclass
class ForecastParagraph:
    title: str
    text: str


class WeatherService:
    hostname: str
    api_key: str

    def __init__(self, hostname: str, api_key: str):
        self.hostname = hostname
        self.api_key = api_key

    def get_regional_text_forecast(self, region: int) -> List[ForecastParagraph]:
        url = f"{self.hostname}/public/data/txt/wxfcs/regionalforecast/json/{region}?key={self.api_key}"
        response = requests.get(url)
        data = response.json()
        first_period_paragraphs = data["RegionalFcst"]["FcstPeriods"]["Period"][0]["Paragraph"]
        return [ForecastParagraph(title=para["title"], text=para["$"]) for para in first_period_paragraphs]

    def get_location_forecast(self, location_id: int, resolution: Resolution) -> Dict:
        url = f"{self.hostname}/public/data/val/wxfcs/all/json/{location_id}?res={get_resolution_param(resolution)}&key={self.api_key}"
        response = requests.get(url)
        return response.json()


if __name__ == '__main__':
    weather_service = get_weather_service()
    # response = weather_service.get_regional_text_forecast(region=Region.EASTERN_ENGLAND)
    response = weather_service.get_location_forecast(location_id=351196, resolution=Resolution.HOURLY)
    print(response)
