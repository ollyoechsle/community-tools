export interface StopDefinition {
    id: string;
    label: string;
    indicator: string;
    lat?: number;
    long?: number;
}

export interface DirectionDefinition {
    id: string;
    label: string;
    stops: StopDefinition[];
}

export interface BusDeparture {
    destination: string;
    scheduled: string;
    estimated: string;
    service: string;
    stop: string;
}

export interface BusResponse {
    directions: DirectionDefinition[]
    departures: BusDeparture[]
}

export interface ImageResponse {
    url: string;
    alt: string
}