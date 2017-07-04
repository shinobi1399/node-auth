import {MongoClient} from "mongodb";

let _migrations: Migration[] = [];

function addMigration(migration: Migration): void {
    if (_migrations.some(x => x.timestamp === migration.timestamp)) {
    throw new Error('migration with id already exists:' + migration.timestamp);
}
}

export class Migrator {
    constructor(private client: MongoClient) {
    }

}

export abstract class Migration {
    public timestamp: number;

    public abstract apply(): void;
    constructor(id: string) {
        addMigration(this);
    }
}
