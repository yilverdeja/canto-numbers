import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '@/components/base/PageHeader.vue'

test("should render correctly", async () => {
	expect(Component).toBeTruthy()

	const wrapper = mount(Component)

	// has h1 brand
	expect(wrapper.find("h1").exists()).toBeTruthy()
	expect(wrapper.find("h1").text()).toContain("CantoNumbers")

	// doensn't have nav links
	expect(wrapper.find("a").exists()).toBeFalsy()
})
