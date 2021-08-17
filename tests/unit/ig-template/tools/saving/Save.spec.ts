import { IgtSaveUpdate } from "@/ig-template/tools/saving/IgtSaveUpdate";

class DummySaveUpdate extends IgtSaveUpdate {
    
    versionUpdates = {
        '0.1.0': (saveData: Record<string, unknown>) => {
            saveData['test'] = 10;
        },
        '0.1.1': (saveData: Record<string, unknown>) => {
            saveData['test'] = saveData['test'] as number + 10;
        },
        '0.2.0': (saveData: Record<string, unknown>) => {
            saveData['test'] = saveData['test'] as number / 2;
        },
    };

}

describe('Saving', () => {

    test('updating save', () => {
        const saveUpdate = new DummySaveUpdate();

        let saveData: Record<string, unknown> = {'version': '0.0.1'};
        let newSaveData = saveUpdate.applyUpdates(saveData);
        expect(newSaveData['test']).toBe(10);

        saveData = {'version': '0.1.0', 'test': 30};
        newSaveData = saveUpdate.applyUpdates(saveData);
        expect(newSaveData['test']).toBe(20);
    });

    test('save should not update', () => {
        const saveUpdate = new DummySaveUpdate();

        let saveData: Record<string, unknown> = {'version': '0.2.0', 'test': 20};
        let newSaveData = saveUpdate.applyUpdates(saveData);
        expect(newSaveData['test']).toBe(20);

        saveData = {'version': '0.3.0', 'test': 30};
        newSaveData = saveUpdate.applyUpdates(saveData);
        expect(newSaveData['test']).toBe(30);
    });
});
