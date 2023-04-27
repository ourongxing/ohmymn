declare global {
  const NSTimer: {
    /**
     * @returns NSTimer*
     * @param f JSValue*
     */
    scheduledTimerWithTimeInterval(
      ti: NSTimeInterval,
      yesOrNo: boolean,
      f: (timer: NSTimer) => void
    ): NSTimer
  }
}

export declare type NSTimeInterval = number
export declare type NSTimer = {
  fire(): void
  /**
   * @returns NSDate*
   */
  fireDate(): Date
  /**
   * @param date NSDate*
   */
  setFireDate(date: Date): void
  timeInterval(): NSTimeInterval
  tolerance(): NSTimeInterval
  setTolerance(tolerance: NSTimeInterval): void
  invalidate(): void
  isValid(): boolean
  userInfo(): any
}
