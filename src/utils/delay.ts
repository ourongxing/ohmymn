import { Timer } from "~/typings"

export function delay(sec: number) {
  return new Promise<NSTimer>(resolve =>
    NSTimer.scheduledTimerWithTimeInterval(sec, false, resolve)
  )
}

export async function delayBreak(
  times: number,
  sec: number,
  f: () => boolean
): Promise<boolean> {
  for (let i = 0; i < times; i++) {
    if (f()) return true
    await delay(sec)
  }
  return false
}

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
