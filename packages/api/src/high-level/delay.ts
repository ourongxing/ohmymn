import type { NSTimer } from "../low-level"

export declare type Timer = {
  /**
   * Stop this timer
   */
  invalidate: () => void
}

/**
 * Delay for a while
 * @param sec unit `s`
 * @example
 * // do something
 * await delay(1)
 * // do something
 */
export function delay(sec: number) {
  return new Promise<NSTimer>(resolve =>
    NSTimer.scheduledTimerWithTimeInterval(sec, false, resolve)
  )
}

/**
 * Loop until `condition` return `true` or `times` is reached
 * @param times loop times
 * @param sec unit `s`, duration of each loop
 * @param condition end condition
 * @returns `true` if `condition` return `true`, otherwise `false`
 */
export async function loopBreak(
  times: number,
  sec: number,
  condition: () => boolean
): Promise<boolean> {
  for (let i = 0; i < times; i++) {
    if (condition()) return true
    await delay(sec)
  }
  return false
}

/**
 * call `f` every `sec` seconds until Timer invalidate
 * @param sec unit `s`
 * @param f
 * @returns Timer, call `invalidate` to stop this timer
 */
export async function setTimeInterval(
  sec: number,
  f: () => any
): Promise<Timer> {
  const setTimer = async (
    sec: number,
    f: () => any,
    config: { stop: boolean }
  ): Promise<void> => {
    while (1) {
      if (config.stop) break
      f()
      await delay(sec)
    }
  }
  const config = {
    stop: false
  }
  setTimer(sec, f, config)
  return {
    invalidate: () => {
      config.stop = true
    }
  }
}
