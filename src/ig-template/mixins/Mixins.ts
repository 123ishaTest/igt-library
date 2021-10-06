import {IgtFeature} from "@/index";

// Needed for all mixins
export type FeatureConstructor<T = IgtFeature> = abstract new (...args: any[]) => T;

