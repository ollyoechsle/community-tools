import json

from services.weather import convert_to_weather_dto


def test_get_convert_json_to_weather_data():
    with open('weather.json') as json_file:
        data = json.load(json_file)
        forecast = convert_to_weather_dto(data)
        assert len(forecast.periods) == 5