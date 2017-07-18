import {default as mongoMigrator,} from "./common/data/mongo-migrate";

export function addMigrations() {
  mongoMigrator.addMigration({
    timestamp: 1500401880893,
    description: 'test migration',
    apply: db => {

    }
  });
}

