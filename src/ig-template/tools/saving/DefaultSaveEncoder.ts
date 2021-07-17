import { IgtSaveEncoder } from "./IgtSaveEncoder";

export class DefaultSaveEncoder extends IgtSaveEncoder {

    encode(data: string): string {
        return data;
    }
    decode(data: string): string {
        return data;
    }

}