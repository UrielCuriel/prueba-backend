import {DeepPartial} from "typeorm";

export abstract class Model<T> {
    constructor(data?: DeepPartial<T>) {
        Object.assign(this, data);
    }
}
