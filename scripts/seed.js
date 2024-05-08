const { db } = require('@vercel/postgres');
const {
    users,
    vacancies,
    requirements,
    locations,
    requirement_values
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        //Create the users table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS users(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`;
        console.log(`Created "users" table`);

        //Insert data into the "users" table
        const insertedUsers = await Promise.all(
            users.map(async (user)=>{
                const hashedPassword = await bcrypt.hash(user.password, 10)
                return client.sql`
                INSERT INTO users (id,name,email,password)
                VALUES (${user.id},${user.name}, ${user.email}, ${hashedPassword})
                ON CONFLICT (id) DO NOTHING;`;
            }),
        );
        console.log(`Seeded ${insertedUsers.length} users`);
        return {
            createTable,
            users: insertedUsers
        };
    } catch (error){
        console.error('Error seeding users', error);
        throw error;
    }
}

async function seedLocations(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        //Create the users table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS locations(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );`;
        console.log(`Created "locations" table`);

        //Insert data into the "users" table
        const insertedLocations = await Promise.all(
            locations.map(async (location)=>{
    
                return client.sql`
                INSERT INTO locations (id,name)
                VALUES (${location.id},${location.name})
                ON CONFLICT (id) DO NOTHING;`;
            }),
        );
        console.log(`Seeded ${insertedLocations.length} locations`);
        return {
            createTable,
            locations: insertedLocations
        };
    } catch (error){
        console.error('Error seeding locations', error);
        throw error;
    }
}

async function seedVacancies(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS vacancies(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            location_id UUID NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL
        );
        `;

        console.log(`Created "vacancies" table`);

        const insertedVacancies = await Promise.all(
            vacancies.map(
                (vacancy)=> client.sql`
                INSERT INTO vacancies (id,name, location_id,status,date)
                VALUES (${vacancy.id},${vacancy.name},${vacancy.location_id},${vacancy.status}, ${vacancy.date})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedVacancies.length} vacancies`);
        return {
            createTable,
            vacancies: insertedVacancies};
    }catch(error){
            console.error('Error seeding vacancies:', error);
            throw error;
        }
}



async function seedRequirements(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirements(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            vacancy_id UUID NOT NULL
        );
        `;

        console.log(`Created "requirements" table`);

        const insertedRequirements = await Promise.all(
            requirements.map(
                (requirement)=> client.sql`
                INSERT INTO requirements (id,name, vacancy_id)
                VALUES (${requirement.id},${requirement.name},${requirement.vacancy_id})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedRequirements.length} requirements`);
        return {
            createTable,
            requirements: insertedRequirements};
    }catch(error){
            console.error('Error seeding requirements:', error);
            throw error;
        }
}

async function seedRequirementValues(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirement_values(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            requirement_id UUID NOT NULL
        );
        `;

        console.log(`Created "requirement_values" table`);

        const insertedRequirementValues = await Promise.all(
            requirement_values.map(
                (requirementValue)=> client.sql`
                INSERT INTO requirement_values (name, requirement_id)
                VALUES (${requirementValue.name},${requirementValue.requirement_id})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedRequirementValues.length} requirement_values`);
        return {
            createTable,
            requirement_values: insertedRequirementValues};
    }catch(error){
            console.error('Error seeding requirement_values:', error);
            throw error;
        }
}

async function main() {
    const client = await db.connect();
  
    await seedUsers(client);
    await seedLocations(client);
    await seedVacancies(client);
    await seedRequirements(client);
    await seedRequirementValues(client);
    await client.end();
  }
  
  main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });