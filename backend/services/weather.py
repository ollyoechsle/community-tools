from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from time import strptime
from typing import List, Dict, Iterable

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


@dataclass
class WeatherForecastPeriod:
    day: str
    timeOfDay: str
    icon: str
    report: str
    temperature: str
    windDirection: str
    windSpeed: str


@dataclass
class WeatherForecast:
    periods: List[WeatherForecastPeriod]


REPORT_CODE_LOOKUP = {
    "NA": {"name": "Not Available", "className": "notAvailable"},
    "0": {"name": "Clear", "className": "clearNight"},
    "1": {"name": "Sunny", "className": "clearDay"},
    "2": {"name": "Partly cloudy", "className": "clearNight"},
    "3": {"name": "Partly cloudy", "className": "clearDay"},
    "5": {"name": "Mist", "className": "fogMist"},
    "6": {"name": "Fog", "className": "fogMist"},
    "7": {"name": "Cloudy", "className": "cloudy"},
    "8": {"name": "Overcast", "className": "cloudy"},

    "9": {"name": "Light rain shower", "className": "lightRainShowerNight"},
    "10": {"name": "Light rain shower", "className": "lightRainShowerDay"},

    "11": {"name": "Drizzle", "className": "lightRain"},
    "12": {"name": "Light rain", "className": "lightRain"},

    "13": {"name": "Heavy rain shower", "className": "heavyRain"},
    "14": {"name": "Heavy rain shower", "className": "heavyRain"},
    "15": {"name": "Heavy rain", "className": "heavyRain"},

    "16": {"name": "Sleet shower", "className": "sleet"},
    "17": {"name": "Sleet shower", "className": "sleet"},
    "18": {"name": "Sleet", "className": "sleet"},

    "19": {"name": "Hail shower", "className": "lightSnowDay"},
    "20": {"name": "Hail shower", "className": "lightSnowNight"},
    "21": {"name": "Hail", "className": "lightSnowDay"},

    "22": {"name": "Light snow shower", "className": "lightSnowDay"},
    "23": {"name": "Light snow shower", "className": "lightSnowNight"},
    "24": {"name": "Light snow", "className": "lightSnowDay"},

    "25": {"name": "Heavy snow shower", "className": "heavySnow"},
    "26": {"name": "Heavy snow shower", "className": "heavySnow"},
    "27": {"name": "Heavy snow", "className": "heavySnow"},

    "28": {"name": "Thunder shower", "className": "thunderStorm"},
    "29": {"name": "Thunder shower", "className": "thunderStorm"},
    "30": {"name": "Thunder", "className": "thunderStorm"}
}


def get_day(iso_date: str) -> str:
    date = datetime.strptime(iso_date, '%Y-%m-%dZ')
    return date.strftime('%a')


def get_periods(periods: Dict) -> Iterable[WeatherForecastPeriod]:
    for period in periods:
        for report in period['Rep']:
            temp_key = 'Dm' if report['$'] == 'Day' else 'Nm'
            yield WeatherForecastPeriod(
                day=get_day(period['value']),
                timeOfDay=report['$'],
                icon=REPORT_CODE_LOOKUP[report['W']]["className"],
                report=REPORT_CODE_LOOKUP[report['W']]["name"],
                temperature=report[temp_key],
                windDirection=report['D'],
                windSpeed=report['S']
            )


def convert_to_weather_dto(data: Dict) -> WeatherForecast:
    site_report = data['SiteRep']
    return WeatherForecast(
        periods=list(get_periods(site_report['DV']['Location']['Period']))
    )


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
        return convert_to_weather_dto(response.json())


if __name__ == '__main__':
    weather_service = get_weather_service()
    # response = weather_service.get_regional_text_forecast(region=Region.EASTERN_ENGLAND)
    response = weather_service.get_location_forecast(location_id=351196, resolution=Resolution.HOURLY)
    print(response)
