export abstract class IgtSaveEncoder {
    /**
     * Encodes the stringified save data
     * @param data The save data
     * @returns An encoded save string to be stored in localStorage
     */
    abstract encode(data: string): string;

    /**
     * Decodes the save data into a JSON string
     * @param data The save data
     * @returns The save data in a JSON string format
     */
    abstract decode(data: string): string;
}