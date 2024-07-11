const { db } = require('@vercel/postgres');
const {
    users,
    groups,
    terms,
    jobs,
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


async function seedJobGroups(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        //Create the users table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS job_groups(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            job_group VARCHAR(255) NOT NULL UNIQUE
        );`;
        console.log(`Created "job_group" table`);

        //Insert data into the "users" table
        const insertedJopGroup = await Promise.all(
            groups.map(async (jobgroup)=>{
    
                return client.sql`
                INSERT INTO job_groups (id,job_group)
                VALUES (${jobgroup.id},${jobgroup.job_group})
                ON CONFLICT (id) DO NOTHING;`;
            }),
        );
        console.log(`Seeded ${insertedJopGroup.length} stations`);
        return {
            createTable,
            jobGroups: insertedJopGroup
        };
    } catch (error){
        console.error('Error seeding jobgroups', error);
        throw error;
    }
}

async function seedTerms(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        //Create the terms table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS terms(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            term VARCHAR(255) NOT NULL UNIQUE
        );`;
        console.log(`Created "terms" table`);

        //Insert data into the "terms" table
        const insertedTerms = await Promise.all(
            terms.map(async (term)=>{
    
                return client.sql`
                INSERT INTO terms (id,term)
                VALUES (${term.id},${term.term})
                ON CONFLICT (id) DO NOTHING;`;
            }),
        );
        console.log(`Seeded ${insertedTerms.length} terms`);
        return {
            createTable,
            terms: insertedTerms
        };
    } catch (error){
        console.error('Error seeding terms', error);
        throw error;
    }
}

async function seedJobs(client){
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS jobs(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            position VARCHAR(255) NOT NULL UNIQUE,
            station_id UUID NOT NULL,
            group_id UUID NOT NULL,
            term_id UUID NOT NULL,
            period VARCHAR(255) NOT NULL,
            startDate VARCHAR(255) NOT NULL,
            endDate VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL
        );
        `;

        console.log(`Created "jobs" table`);

        const insertedJobs = await Promise.all(
            jobs.map(
                (job)=> client.sql`
                INSERT INTO jobs (id,position, station_id,group_id,term_id,period,startDate,endDate,status,date)
                VALUES (${job.id},${job.position},${job.station_id},${job.group_id},${job.term_id},${job.period},${job.startDate},${job.endDate},${job.status}, ${job.date})
                ON CONFLICT (id) DO NOTHING;
                `,
            ),
        );
        console.log(`Seeded ${insertedJobs.length} jobs`);
        return {
            createTable,
            jobs: insertedJobs};
    }catch(error){
            console.error('Error seeding jobs:', error);
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
            requirement TEXT NOT NULL,
            position_id UUID NOT NULL,
            group_id UUID NOT NULL,
            rqtype_id UUID NOT NULL
        );
        `;

        console.log(`Created "requirements" table`);

        const insertedRequirements = await Promise.all(
            requirements.map(
                (requirement)=> client.sql`
                INSERT INTO requirements (id,requirement, position_id,group_id,rqtype_id)
                VALUES (${requirement.id},${requirement.requirement},${requirement.position_id}, ${requirement.group_id},${requirement.rqtype_id})
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

// async function seedResponsibilities(client){
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS responsibilities(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             responsibility TEXT NOT NULL,
//             position_id UUID NOT NULL,
//             group_id UUID NOT NULL
//         );
//         `;

//         console.log(`Created "requirements" table`);

//         const insertedRequirements = await Promise.all(
//             requirements.map(
//                 (requirement)=> client.sql`
//                 INSERT INTO requirements (id,requirement, position_id,group_id,rqtype_id)
//                 VALUES (${requirement.id},${requirement.requirement},${requirement.position_id}, ${requirement.group_id},${requirement.rqtype_id})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedRequirements.length} requirements`);
//         return {
//             createTable,
//             requirements: insertedRequirements};
//     }catch(error){
//             console.error('Error seeding requirements:', error);
//             throw error;
//         }
// }


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
    await seedJobGroups(client);
    await seedTerms(client);
    await seedJobs(client);
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