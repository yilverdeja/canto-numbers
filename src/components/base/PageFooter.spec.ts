import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '@/components/base/PageFooter.vue'

test('PageFooter', async () => {
  expect(Component).toBeTruthy()

  const wrapper = mount(Component, {})
  expect(wrapper.text()).toContain('footer')
})