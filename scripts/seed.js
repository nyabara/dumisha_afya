const { db } = require('@vercel/postgres');
const {
    users,
    vacancies,
    requirements,
    stations,
    requirement_values,
    requirement_types,
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


async function seedStations(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        //Create the users table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS stations(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            station VARCHAR(255) NOT NULL UNIQUE
        );`;
        console.log(`Created "stations" table`);

        //Insert data into the "users" table
        const insertedStations = await Promise.all(
            stations.map(async (station)=>{
    
                return client.sql`
                INSERT INTO stations (id,station)
                VALUES (${station.id},${station.station})
                ON CONFLICT (id) DO NOTHING;`;
            }),
        );
        console.log(`Seeded ${insertedStations.length} stations`);
        return {
            createTable,
            stations: insertedStations
        };
    } catch (error){
        console.error('Error seeding stations', error);
        throw error;
    }
}

async function seedVacancies(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS vacancies(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            position VARCHAR(255) NOT NULL UNIQUE,
            station_id UUID NOT NULL,
            period VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            terms VARCHAR(255) NOT NULL
        );
        `;

        console.log(`Created "vacancies" table`);

        const insertedVacancies = await Promise.all(
            vacancies.map(
                (vacancy)=> client.sql`
                INSERT INTO vacancies (id,position, station_id,period,status,date,terms)
                VALUES (${vacancy.id},${vacancy.position},${vacancy.station_id},${vacancy.period},${vacancy.status}, ${vacancy.date},${vacancy.terms})
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

async function seedRequirementType(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirement_types(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            requirement_type VARCHAR(255) NOT NULL
        );
        `;

        console.log(`Created "requirement_types" table`);

        const insertedRequirementTypes = await Promise.all(
            requirement_types.map(
                (requirement_type)=> client.sql`
                INSERT INTO requirement_types (id,requirement_type)
                VALUES (${requirement_type.id},${requirement_type.requirement_type})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedRequirementTypes.length} requirement_types`);
        return {
            createTable,
            requirement_types: insertedRequirementTypes};
    }catch(error){
            console.error('Error seeding requirement_types:', error);
            throw error;
        }
}

async function seedRequirements(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirements(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            requirement VARCHAR(255) NOT NULL,
            position_id UUID NOT NULL,
            rqtype_id UUID NOT NULL
        );
        `;

        console.log(`Created "requirements" table`);

        const insertedRequirements = await Promise.all(
            requirements.map(
                (requirement)=> client.sql`
                INSERT INTO requirements (id,requirement, position_id,rqtype_id)
                VALUES (${requirement.id},${requirement.requirement},${requirement.position_id},${requirement.rqtype_id})
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
            requirement_value VARCHAR(255) NOT NULL,
            requirement_id UUID NOT NULL
        );
        `;

        console.log(`Created "requirement_values" table`);

        const insertedRequirementValues = await Promise.all(
            requirement_values.map(
                (requirementValue)=> client.sql`
                INSERT INTO requirement_values (requirement_value, requirement_id)
                VALUES (${requirementValue.requirement_value},${requirementValue.requirement_id})
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
    await seedStations(client);
    await seedVacancies(client);
    await seedRequirementType(client);
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