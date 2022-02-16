from services.buses import get_default_bus_service


def get_convert_xml_to_bus_departures():
    with open('buses.xml') as xml_file:
        xml_data = "\n".join([line for line in xml_file])
        service = get_default_bus_service()
        departures = service.convert_xml(xml_data)
        assert len(departures) > 0

