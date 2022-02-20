export interface BusDeparture {
    destination: string;
    scheduled: string;
    estimated: string;
    service: string;
    stop: string;
}

export interface BusResponse {
    departures: BusDeparture[]
}