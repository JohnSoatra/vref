import Max from "../constants/max";
import { Changes, OnChange, ChangeEvent } from "../types/ref";
import { getNow, nextFrame } from "./utils";

export default function handleChange(
  changes: Changes,
  onChange: OnChange | undefined,
  props: ChangeEvent,
) {
  if (onChange) {
    const now = getNow();

    if (now - changes.latest > 16) {
      changes.tick = 0;
      changes.latest = now;
    } else if (changes.tick >= Max.UpdateTick) {
      console.warn(
        `[vref] Maximum update limit reached (${Max.UpdateTick} per frame). ` +
        `This may indicate a reactive loop or excessive nested updates. ` +
        `Consider optimizing your state mutations or throttling updates.`
      );
    } else {
      changes.tick += 1;
      changes.latest = now;
    }

    if (!changes.scheduled) {
      changes.scheduled = true;
      nextFrame(() => {
        changes.scheduled = false;
        try {
          onChange?.(props);
        } catch (error) {
          console.error('[vref] onChange error:', error);
        }
      });
    }
  }
}
