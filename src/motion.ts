// Curves from the animate skill: strong ease-out for entering/leaving, strong ease-in-out for
// things that move across the screen.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

// The hand that carries a plate between belt and table: reach, carry, leave (seconds).
// The belt plate hides/reappears and the table plate fades in on these beats (see .plate-root in index.css).
export const HAND_REACH = 0.28
export const HAND_CARRY = 0.42
export const HAND_LEAVE = 0.25
export const HAND_BACK = HAND_REACH + HAND_CARRY + HAND_LEAVE // putting a plate back, before the next one is taken
