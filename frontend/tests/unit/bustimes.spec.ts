import {shallowMount} from "@vue/test-utils";
import BusTimes from "@/components/BusTimes.vue";
import axios from "axios";
import {BusDeparture} from "@/model/model";

jest.mock("axios");

function givenDepartures(mockDepartures: BusDeparture[]) {
    // @ts-ignore
    axios.get.mockResolvedValueOnce({
        data: mockDepartures
    });
}

describe("BusTimes.vue", () => {
    it("displays all stops", async () => {
        givenDepartures([])

        const wrapper = shallowMount(BusTimes, {
            propsData: {
                stops: "stop1, stop2"
            }
        });
        await wrapper.vm.$nextTick()
        expect(wrapper.find(".stops").exists()).toBe(true)
        expect(wrapper.findAll(".stops li")).toHaveLength(2);
    });

    it("displays zero departures", async () => {

        givenDepartures([])

        const wrapper = shallowMount(BusTimes, {
            propsData: {
                stops: "stop1"
            }
        });
        await wrapper.vm.$nextTick()
        expect(wrapper.findAll(".bus-departures tbody tr")).toHaveLength(0);
    });

    it("displays more than zero departures", async () => {

        givenDepartures([
            {
                destination: "Jupiter",
                scheduled: "Today",
                estimated: "Today",
                service: "Voyager",
                stop: "J001",
            }
        ])

        const wrapper = shallowMount(BusTimes, {
            propsData: {
                stops: "earth"
            }
        });
        await wrapper.vm.$nextTick()
        expect(wrapper.findAll(".bus-departures tbody tr")).toHaveLength(1);
    });
});
