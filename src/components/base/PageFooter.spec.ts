import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '@/components/base/PageFooter.vue'

test("should render correctly", async () => {
	expect(Component).toBeTruthy()

	const wrapper = mount(Component)

	// has one link to github
	expect(wrapper.find("a").exists()).toBeTruthy()
	expect(wrapper.findAll("a")).toHaveLength(1)
	expect(wrapper.get("a").attributes("href")).toBe("https://github.com/yilverdeja/canto-numbers")

})