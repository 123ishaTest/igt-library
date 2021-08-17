import { gt, lt, SemVer } from "semver";

type VersionUpdate = (saveData: Record<string, unknown>) => void;

export abstract class IgtSaveUpdate {

    /**
     * List of VersionUpdates that will be applied when the game version is incremented
     * The key will be the version that the VersionUpdate was created for. If the save being
     * loaded is less than the version key, the VersionUpdate will be applied.
     */
    abstract versionUpdates: {[key: string]: VersionUpdate};

    /**
     * Update the SaveData to match the current game version
     * @param saveData The SaveData JSON object.
     */
    applyUpdates(saveData: Record<string, unknown>): Record<string, unknown> {
        const saveVersion = new SemVer(saveData['version'] as string)
        Object.entries(this.versionUpdates)
            .filter(([version]) => lt(saveVersion, version))
            .sort(([a], [b]) => gt(a, b) ? 1 : -1)
            .forEach(([version, update]) => {
                const prevSaveData = JSON.parse(JSON.stringify(saveData));
                console.info(`Applying version update ${version}`);
                update(prevSaveData);
                saveData = prevSaveData;
            });
        return saveData;
    }

}