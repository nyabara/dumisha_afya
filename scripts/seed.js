const { db } = require('@vercel/postgres');
const {
    users,
    vacancies,
    requirements,
    requirement_types,
    requirement_values
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        //Create the users table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
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

async function seedVacancies(client){
    try {
        await client.sql`CREATE EXTENSI IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS vacancies(
            id SERIAL RIMARY KEY,
            name VARCHAR(255) NOT NULL,
            place VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL
        );
        `;

        console.log(`Created "vacancies" table`);

        const insertedVacancies = await Promise.all(
            vacancies.map(
                (vacancy)=> client.sql`
                INSERT INTO vacancies (name, place,status,date)
                VALUES (${vacancy.name},${vacancy.place},${vacancy.status}, ${vacancy.date})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedVacancies.length} vacancies`);
        return {
            createTable,
            vacancies: insertedVacancies,};
    }catch(error){
            console.error('Error seeding vacancies:', error);
            throw error;
        }
}



async function seedRequirements(client){
    try {
        await client.sql`CREATE EXTENSI IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirements(
            id SERIAL RIMARY KEY,
            name VARCHAR(255) NOT NULL,
            vacancy_id INT NOT NULL,
        );
        `;

        console.log(`Created "requirements" table`);

        const insertedRequirements = await Promise.all(
            requirements.map(
                (requirement)=> client.sql`
                INSERT INTO vacancies (name, vacancy_id)
                VALUES (${requirement.name},${requirement.vacancy_id})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedRequirements.length} vacancies`);
        return {
            createTable,
            requirements: insertedRequirements};
    }catch(error){
            console.error('Error seeding vacancies:', error);
            throw error;
        }
}


async function seedRequirementTypes(client){
    try {
        await client.sql`CREATE EXTENSI IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirement_types(
            id SERIAL RIMARY KEY,
            name VARCHAR(255) NOT NULL,
            requirement_id INT NOT NULL,
        );
        `;

        console.log(`Created "requirement_types" table`);

        const insertedRequirementTypes = await Promise.all(
            requirement_types.map(
                (requirementType)=> client.sql`
                INSERT INTO vacancies (name, requirement_id)
                VALUES (${requirementType.name},${requirementType.requirement_id})
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


async function seedRequirementValues(client){
    try {
        await client.sql`CREATE EXTENSI IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS requirement_values(
            id SERIAL RIMARY KEY,
            name VARCHAR(255) NOT NULL,
            requirement_type_id INT NOT NULL,
        );
        `;

        console.log(`Created "requirement_values" table`);

        const insertedRequirementValues = await Promise.all(
            requirement_values.map(
                (requirementValue)=> client.sql`
                INSERT INTO requirement_values (name, place,status,date)
                VALUES (${requirementValue.name},${requirementValue.requirement_type_id})
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