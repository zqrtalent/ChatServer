## Run local docker

**npm run start-docker** - start docker services.

**npm run stop-docker** - stop docker services.

## Add database migration

**npm run add-migration** migration-xxxxx-xxxx

This command will create migration **migration-xxxxx-xxxx.js** file inside the project. After you have to manually write code for the data migration.

## Update database

**npm run updatedatabase**

## Rollback to a migration

**npm run rollback-database** migration-xxxxx-xxxx