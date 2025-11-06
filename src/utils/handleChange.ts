import Max from "../constants/max";
import { getNow, nextFrame } from "./utils";
import { Ticks, ChangeEvent, RefOptions } from "../types/ref";

function maxTick(options: RefOptions) {
  return (
    options.maxTick && (options.maxTick > 0 && options.maxTick <= Max.LimitTick) ?
      options.maxTick :
      Max.Tick
  );
}
function maxTickMessage(options: RefOptions) {
  return (
    options.maxTickMessage ||
    `[vref] Maximum update limit reached (${maxTick(options)} per frame). ` +
    `This may indicate a reactive loop or excessive nested updates. ` +
    `Consider optimizing your state mutations or throttling updates.`
  );
}
export default function handleChange(
  event: ChangeEvent,
  ticks: Ticks,
  options: RefOptions,
) {
  if (options.onchange) {
    const now = getNow();
    if (now - ticks.latest > 16) {
      ticks.tick = 0;
      ticks.latest = now;
    } else if (ticks.tick >= maxTick(options)) {
      console.warn(maxTickMessage(options));
    } else {
      ticks.tick += 1;
      ticks.latest = now;
    }
    if (!ticks.scheduled) {
      ticks.scheduled = true;
      nextFrame(() => {
        ticks.scheduled = false;
        try {
          options.onchange?.(event);
        } catch (error) {
          console.error('[vref] onchange error:', error);
        }
      });
    }
  }
}
