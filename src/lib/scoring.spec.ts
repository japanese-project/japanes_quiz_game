import { describe, expect, it } from 'vitest'
import { calculateScore, formatScore, roundScore } from './scoring'

describe('calculateScore', () => {
	it.each([
		[20, 1],
		[19, 1],
		[18, 0.9],
		[17, 0.85],
		[16, 0.8],
		[15, 0.75],
		[14, 0.7],
		[13, 0.65],
		[12, 0.6],
		[11, 0.55],
		[10, 0.5],
		[9, 0.45],
		[8, 0.4],
		[7, 0.35],
		[6, 0.3],
		[5, 0.25],
		[4, 0.2],
		[3, 0.15],
		[2, 0.1],
		[1, 0.05],
		[0, 0],
	])('awards %s seconds as %s points', (seconds, expected) => {
		expect(calculateScore(seconds, true)).toBe(expected)
	})

	it('awards no points for an incorrect answer', () => {
		expect(calculateScore(20, false)).toBe(0)
	})

	it('clamps times outside the countdown range', () => {
		expect(calculateScore(100, true)).toBe(1)
		expect(calculateScore(-10, true)).toBe(0)
	})

	it('uses completed remaining seconds and rejects invalid times', () => {
		expect(calculateScore(18.9, true)).toBe(0.9)
		expect(calculateScore(Number.NaN, true)).toBe(0)
	})
})

describe('score precision helpers', () => {
	it('rounds accumulated scores to hundredths', () => {
		expect(roundScore(0.1 + 0.2)).toBe(0.3)
		expect(formatScore(0.1 + 0.2)).toBe('0.30')
	})
})
