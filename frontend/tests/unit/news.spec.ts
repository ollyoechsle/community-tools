import { shallowMount } from "@vue/test-utils";
import News from "@/components/News.vue";

describe("News.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(News, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
