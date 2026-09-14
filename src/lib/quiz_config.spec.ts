import { describe, it, expect } from 'vitest'
import { ROUND_MODES, round_size, type RoundModeId } from './quiz_config'

const mode = (id: RoundModeId) => ROUND_MODES.find((entry) => entry.id === id)!

describe('round_size', () => {
	it('keeps easy to a short round', () => {
		expect(round_size(mode('easy'), 45)).toBe(10)
	})

	it('gives medium a longer round', () => {
		expect(round_size(mode('medium'), 45)).toBe(25)
	})

	it('gives hard every question in the category', () => {
		expect(round_size(mode('hard'), 45)).toBe(45)
	})

	it('never asks for more questions than the category holds', () => {
		expect(round_size(mode('easy'), 6)).toBe(6)
		expect(round_size(mode('medium'), 6)).toBe(6)
		expect(round_size(mode('hard'), 0)).toBe(0)
	})
})
