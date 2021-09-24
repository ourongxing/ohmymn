export {}
declare global {
  type NSTimeInterval = number
  class NSTimer {
    /**
     * @returns NSTimer*
     * @param block JSValue*
     */
    static scheduledTimerWithTimeInterval(
      ti: NSTimeInterval,
      yesOrNo: boolean,
      block: (timer: NSTimer) => void
    ): NSTimer
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
    userInfo(): WrapperObj<any>
  }
}
