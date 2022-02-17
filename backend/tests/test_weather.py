import json

from services.weather import convert_to_weather_dto


def test_get_convert_json_to_weather_data():
    with open('weather.json') as json_file:
        data = json.load(json_file)
        forecast = convert_to_weather_dto(data)
        assert len(forecast.periods) == 10
        assert forecast.periods[0].day == "Thu"
        assert forecast.periods[0].timeOfDay == "Day"
        assert forecast.periods[0].temperature == "9"
        assert forecast.periods[0].windDirection == "W"
        assert forecast.periods[0].windSpeed == "27"

        assert forecast.periods[1].day == "Thu"
        assert forecast.periods[1].timeOfDay == "Night"
        assert forecast.periods[1].temperature == "5"
        assert forecast.periods[1].windDirection == "SSW"
        assert forecast.periods[1].windSpeed == "9"
