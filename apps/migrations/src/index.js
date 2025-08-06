const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

const runMigrations = async () => {
    try {
        await db.migrate.latest();
        console.log('Migrations completed successfully.');
    } catch (error) {
        console.error('Error running migrations:', error);
    } finally {
        await db.destroy();
    }
};

const runSeeds = async () => {
    try {
        await db.seed.run();
        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error running seeds:', error);
    } finally {
        await db.destroy();
    }
};

const main = async () => {
    await runMigrations();
    await runSeeds();
};

main();