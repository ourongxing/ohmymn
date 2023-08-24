# 等待/间隔
[Code](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/high-level/delay.ts)

## delay
等待一段时间，单位是秒
```ts
/**
 * @param sec unit `s`
 */
declare function delay(sec: number): Promise<NSTimer>;
```

如何使用
```ts
import { delay } from "marginnote"
await delay(1)
// do something after 1 second
```

## loopBreak
每隔一段时间执行一次 `condition` 函数，执行 `times` 次，如果 `condition` 返回 `true`，则停止执行，立即返回 `true`，否则执行 `times` 后返回 `false`。

这个方法的作用是尽可能缩短等待时间，不断地检查某个条件是否满足，如果满足则立即返回，否则继续等待。这个执行次数其实就相当于超时。

```ts
/**
 * @param times loop times
 * @param sec unit `s`, duration of each loop
 * @param condition end condition
 * @returns `true` if `condition` return `true`, otherwise `false`
 */
declare function loopBreak(times: number, sec: number, condition: () => boolean): Promise<boolean>;
```

## setTimeInterval
每隔一段时间执行一次 `f` 函数，需要手动停止。返回一个 `Timer` 对象，调用 `invalidate` 方法停止定时器。

通常用于后台执行，不打断用户操作，比如每隔一段时间保存一次笔记。
```ts
/**
 * @param sec unit `s`
 * @param f
 * @returns Timer, call `invalidate` to stop this timer
 */
declare function setTimeInterval(sec: number, f: () => any): Promise<Timer>;

declare type Timer = {
    /**
     * Stop this timer
     */
    invalidate: () => void;
};
```
