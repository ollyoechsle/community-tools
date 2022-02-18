from services.buses import get_default_bus_service


def test_get_convert_xml_to_bus_departures():
    with open('buses.xml') as xml_file:
        xml_data = xml_file.read()
        service = get_default_bus_service()
        departures = service.convert_xml(xml_data)
        assert len(departures) == 12

        assert departures[0].service == "4"
        assert departures[0].destination == "Dereham, Neatherd high school"

