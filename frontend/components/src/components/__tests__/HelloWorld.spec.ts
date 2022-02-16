import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import News from "../News.vue";

describe("News", () => {
  it("renders properly", () => {
    const wrapper = mount(News, { props: { msg: "Hello Vitest" } });
    expect(wrapper.text()).toContain("Hello Vitest");
  });
});
