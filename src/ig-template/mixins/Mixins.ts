import {IgtFeature} from "@/index";

// Needed for all mixins
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FeatureConstructor<T = IgtFeature> = abstract new (...args: any[]) => T;

