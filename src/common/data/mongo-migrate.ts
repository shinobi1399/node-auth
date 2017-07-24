import {Collection, Db} from 'mongodb';
import {getLogger} from '../logging/logging';
import {mongoUtils} from './mongo-utils';

const MIGRATION_TABLE_NAME = '_migration';

/**
 * Manages mongodb migrations.
 *
 * remarks:
 * Just a simple db migrator. DB migrations should probably execute as a separate step and not part of
 * the application running.
 *
 * There is also no ability to rollback migrations yet. Will have a look at it if its needed.
 */
export class MigrationManager {
  private _migrations: Migration[] = [];

  constructor() {
  }

  /**
   * Adds a migration to the list of migrations that are executed when migrations are run.
   * @param {Migration} migration
   */
  public addMigration(migration: Migration): void {
    if (this._migrations.some(x => x.timestamp === migration.timestamp)) {
      throw new Error('migration with id already exists:' + migration.timestamp);
    }
    this._migrations.push(migration);
  }

  /**
   * Runs database migrations.
   *
   * @param {Db} db
   * The db to run the migrations against.
   * @param {number} stopAtTimestamp
   * Specify the timestamp to stop at or nothing to run all migrations.
   * @returns {Promise<void>}
   */
  public async migrate(db: Db, stopAtTimestamp?: number) {
    this.initialiseMigrationTable();
    let migrationTable = db.collection(MIGRATION_TABLE_NAME);

    let migrations = this._migrations.sort(this.sortMigrations);
    if (migrations.length === 0) {
      getLogger().info('No db migrations found');
    }

    for (let migration of migrations) {
      try {
        if (!!stopAtTimestamp && migration.timestamp > stopAtTimestamp) break;

        let migrationName = `${migration.timestamp}: ${migration.description}`;

        let isProcessed = await mongoUtils.contains(migrationTable, {timestamp: migration.timestamp});
        if (isProcessed) {
          getLogger().info(`skipping migration ${migrationName}`);
        } else {
          getLogger().info(`performing migration ${migrationName}`);
          await this.performMigration(migrationName, migration, db, migrationTable);
          getLogger().info('finished migration: ' + migrationName);
        }
      }
      catch (err) {
        throw err;
      }
    }
  }

  private sortMigrations(m1: Migration, m2: Migration) {
    if (m1.timestamp < m2.timestamp) {
      return -1;
    } else if (m1.timestamp > m2.timestamp) {
      return 1;
    } else {
      return 0;
    }
  }

  private async performMigration(name: string, m, db: Db, migrationTable: Collection) {
    getLogger().info(`running migration ${name}`);
    m.apply(db);
    await migrationTable.insertOne(<MigrationInfo> {
      timestamp: m.timestamp,
      description: m.description,
      dateAdded: new Date()
    });
  }

  private initialiseMigrationTable() {

  }
}

interface MigrationInfo {
  timestamp: number;
  description: string;
  dateAdded: Date;
}

let mongoMigrator = new MigrationManager();

export default mongoMigrator;

export interface Migration {
  /**
   * A unique timestamp based id used to uniquely identify a
   * migration and order them for execution
   */
  timestamp: number;

  /**
   * A friendly name for the migration
   */
  description: string;

  /**
   * the actions to perform on the database when the migraiton is applied.
   * @param {Db} db
   */
  apply(db: Db): Promise<void>;
}
