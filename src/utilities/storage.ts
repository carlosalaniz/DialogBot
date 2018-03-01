import storage from 'node-persist';
import { IStorage } from '../Interfaces/IStorage';
export class NodePersistStorage implements IStorage {
    get(key: string): string {
        storage.initSync();
        let session = storage.getItemSync(key);
        if (session == null)
            storage.setItemSync(key, {})
        let obj = storage.getItemSync(key);
        return JSON.stringify(obj);
    }
    set(key: string, value: any) {
        storage.initSync();
        storage.setItemSync(key, value);
    }
}
