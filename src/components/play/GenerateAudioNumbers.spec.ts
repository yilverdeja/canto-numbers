import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '@/components/play/GenerateAudioNumbers.vue'

test("should render correctly", async () => {
	expect(Component).toBeTruthy()

	const wrapper = mount(Component)
	
	// doesn't have div since show is false by default
	expect(wrapper.find("div").exists()).toBeFalsy()

	await wrapper.setProps({show: true})

	// has div if show is true
	expect(wrapper.find("div").exists()).toBeTruthy()
	
})
