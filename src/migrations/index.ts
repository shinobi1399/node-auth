import {default as mongoMigrator,} from '../common/data/mongo-migrate';
import {InitialSetup} from './1500574683130-initial-service';

export function addMigrations() {
  mongoMigrator.addMigration(new InitialSetup());
}

