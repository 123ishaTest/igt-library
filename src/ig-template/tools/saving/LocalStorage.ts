import { IgtSaveEncoder } from "./IgtSaveEncoder";

export class LocalStorage {
    public static store(key: string, data: Record<string, unknown>, saveEncoder: IgtSaveEncoder): void {
        const saveString = saveEncoder.encode(JSON.stringify(data));
        localStorage.setItem(key, saveString);
    }

    // TODO(@Isha) add error handling here
    public static get(key: string, saveEncoder: IgtSaveEncoder): Record<string, unknown> {
        const saveString = saveEncoder.decode(localStorage.getItem(key) as string);
        return JSON.parse(saveString) as Record<string, unknown>;
    }

    public static delete(key: string): void {
        localStorage.removeItem(key)
    }
}
