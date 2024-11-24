import { InterpolationFn } from "./types";

export const lerp: InterpolationFn = (a: number, b: number, t: number) => ((1 - t) * a + t * b)