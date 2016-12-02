
import { IStorage } from './';
import { IModel, IModelMeta, ICreateOptions, IReadOptions, IUpdateOptions, IRemoveOptions } from '../model';

export class InMemoryStorage implements IStorage {
    private storage: {
        [modelName: string]: any
    } = {};

    constructor(options: any = {}) {
        // TODO: Do Stuff...
    }

    public create<T extends IModel>(model: IModel, meta: IModelMeta, options?: ICreateOptions): Promise<T> {
        return new Promise((resolve) => {
            if (meta.singleton) {
                throw new Error('InMemoryStorage.create() cannot be called on singleton models');
            }
            let modelData = this.getModelData(model, meta);
            let record = {};
            this.writeFields(model, meta, record);
            modelData.push(record);
        });
    }

    public update<T extends IModel>(model: IModel, meta: IModelMeta, where?: any, options?: IUpdateOptions): Promise<boolean> {
        return new Promise((resolve) => {
            if (!meta.singleton && !where) {
                throw new Error('InMemoryStorage.update() requires the \'where\' parameter for non-singleton models');
            }
            let modelData = this.getModelData(model, meta);
            if (meta.singleton) {
                this.writeFields(model, meta, modelData);
                resolve(true);
            }
            else {
                throw new Error('InMemoryStorage.update() not yet implemented for non-singleton models');
            }
        });
    }

    public read<T extends IModel>(model: new() => T, meta: IModelMeta, where?: any, options?: IReadOptions): Promise<T[]> {
        return new Promise((resolve) => {
            if (!meta.singleton && !where) {
                throw new Error('InMemoryStorage.read() requires the \'where\' parameter for non-singleton models');
            }
            let modelData = this.getModelData(model, meta, false);
            if (!modelData) {
                resolve(meta.singleton ? {} : []);
            }
            else {
                if (meta.singleton) {
                    resolve([modelData]);
                }
                else {
                    // TODO: Implement filtering
                    resolve(modelData);
                }
            }
        });
    }

    public remove<T extends IModel>(model: new() => T, meta: IModelMeta, where: any, options?: IRemoveOptions): Promise<boolean> {
        throw new Error('InMemoryStorage.delete() not yet implemented');
    }

    private getModelData(model: IModel, meta: IModelMeta, init = true): any {
        if (!this.storage[meta.name] && init) {
            if (meta.singleton) {
                this.storage[meta.name] = {};
            }
            else {
                this.storage[meta.name] = [];
            }
        }
        return this.storage[meta.name];
    }

    private writeFields(model: IModel, meta: IModelMeta, target: any): void {
        for (let field of meta.fields) {
            target[field.name] = model[field.name];
        }
    }
}
