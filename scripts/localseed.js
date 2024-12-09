// Import required modules using CommonJS syntax

const { Client } = require('pg');
const { 
    users,
    stations,
    groups,
    jobs,
    requirements,
    responsibilities,
    gender_values,
    application_origin_values,
    country_values,
    education_level_values,
    languages_values,
    candidate_information_values,
    degree_name_values,
    applicant_education_values,
    experience_values,
    resume_values,
    cover_letter_values
 } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');


// async function seedUsers(client) {
//     try {
//         // Create the users table
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         const createTable = await client.query(`
//         CREATE TABLE IF NOT EXISTS users(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             email TEXT NOT NULL UNIQUE,
//             password TEXT NOT NULL
//         );`);
//         console.log(`Created "users" table`);

//         // Insert data into the "users" table
//         const insertedUsers = await Promise.all(
//             users.map(async (user) => {
//                 const hashedPassword = await bcrypt.hash(user.password, 10);
//                 const result = await client.query(`
//                 INSERT INTO users (name, email, password)
//                 VALUES ($1, $2, $3)
//                 ON CONFLICT (email) DO NOTHING RETURNING *;`, [user.name, user.email, hashedPassword]);
//                 return result.rows[0]; // Return the inserted user object
//             }),
//         );
//         console.log(`Seeded ${insertedUsers.length} users`);
//         return {
//             createTable,
//             users: insertedUsers
//         };
//     } catch (error) {
//         console.error('Error seeding users', error);
//         throw error;
//     }
// }

async function seedUsers(client) {
    try {
        // Enable UUID generation extension
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

         // Drop the trigger if it exists
         await client.query(`DROP TRIGGER IF EXISTS update_users_timestamp ON users;`);


        // Create the users table with timestamp columns
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS users(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
        console.log(`Created "users" table`);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_users_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update on the "users" table
        await client.query(`
            CREATE TRIGGER update_users_timestamp
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_users_timestamp();
        `);

        console.log(`Added trigger to update "updated_at" on users`);

        // Insert data into the "users" table
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                const result = await client.query(`
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                ON CONFLICT (email) DO NOTHING RETURNING *;`, [user.name, user.email, hashedPassword]);
                return result.rows[0]; // Return the inserted user object
            }),
        );

        console.log(`Seeded ${insertedUsers.filter(Boolean).length} users`);

        return {
            createTable,
            users: insertedUsers.filter(Boolean) // Filter out unsuccessful inserts
        };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}


// async function seedStations(client) {
//     try {
    
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         //Create the stations table
//         const createTable = await client.query(`
//         CREATE TABLE IF NOT EXISTS stations(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             station VARCHAR(255) NOT NULL UNIQUE
//         );`);

//         console.log(`Created "stations" table`);

//         //Insert data into the "users" table
//         const insertedStations = await Promise.all(
//             stations.map(async (station) => {

//                 return client.query(`
//                 INSERT INTO stations (station)
//                 VALUES ($1)
//                 ON CONFLICT (station) DO NOTHING RETURNING *;`, [station.station]);
//             }),
//         );
//         console.log(`Seeded ${insertedStations.length} stations`);
//         return {
//             createTable,
//             stations: insertedStations
//         };
//     } catch (error) {
//         console.error('Error seeding stations', error);
//         throw error;
//     }
// }


async function seedStations(client) {
    try {
        // Enable UUID generation extension
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);


         // Drop the trigger if it exists
         await client.query(`DROP TRIGGER IF EXISTS update_stations_timestamp ON stations;`);


        // Create the stations table with timestamp columns
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS stations(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            station VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        console.log(`Created "stations" table`);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_stations_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update on the "stations" table
        await client.query(`
            CREATE TRIGGER update_stations_timestamp
            BEFORE UPDATE ON stations
            FOR EACH ROW
            EXECUTE FUNCTION update_stations_timestamp();
        `);

        console.log(`Added trigger to update "updated_at" on stations`);

        // Insert data into the stations table
        const insertedStations = await Promise.all(
            stations.map(async (station) => {
                return client.query(`
                    INSERT INTO stations (station)
                    VALUES ($1)
                    ON CONFLICT (station) DO NOTHING RETURNING *;
                `, [station.station]);
            })
        );

        console.log(`Seeded ${insertedStations.filter(Boolean).length} stations`);

        return {
            createTable,
            stations: insertedStations.filter(Boolean) // Filter out unsuccessful inserts
        };
    } catch (error) {
        console.error('Error seeding stations:', error);
        throw error;
    }
}


// async function seedJobGroups(client) {
//     try {
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         //Create the users table
//         const createTable = await client.query(`
//         CREATE TABLE IF NOT EXISTS job_groups(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             job_group VARCHAR(255) NOT NULL UNIQUE
//         );`);
//         console.log(`Created "job_group" table`);

//         //Insert data into the "users" table
//         const insertedJopGroup = await Promise.all(
//             groups.map(async (jobgroup) => {

//                 return client.query(`
//                 INSERT INTO job_groups (job_group)
//                 VALUES ($1)
//                 ON CONFLICT (job_group) DO NOTHING RETURNING *;`, [jobgroup.job_group]);
//             }),
//         );
//         console.log(`Seeded ${insertedJopGroup.length} jobGroups`);
//         return {
//             createTable,
//             jobGroups: insertedJopGroup
//         };
//     } catch (error) {
//         console.error('Error seeding jobgroups', error);
//         throw error;
//     }
// }

async function seedJobGroups(client) {
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);


         // Drop the trigger if it exists
         await client.query(`DROP TRIGGER IF EXISTS update_job_groups_timestamp ON job_groups;`);

        // Create the job_groups table with timestamp columns
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS job_groups(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            job_group VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
        console.log(`Created "job_groups" table`);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_job_groups_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update on the "job_groups" table
        await client.query(`
            CREATE TRIGGER update_job_groups_timestamp
            BEFORE UPDATE ON job_groups
            FOR EACH ROW
            EXECUTE FUNCTION update_job_groups_timestamp();
        `);

        console.log(`Added trigger to update "updated_at" on job_groups`);

        // Insert data into the job_groups table
        const insertedJobGroup = await Promise.all(
            groups.map(async (jobgroup) => {
                return client.query(`
                    INSERT INTO job_groups (job_group)
                    VALUES ($1)
                    ON CONFLICT (job_group) DO NOTHING RETURNING *;
                `, [jobgroup.job_group]);
            })
        );

        console.log(`Seeded ${insertedJobGroup.filter(Boolean).length} jobGroups`);

        return {
            createTable,
            jobGroups: insertedJobGroup.filter(Boolean) // Filter out unsuccessful inserts
        };
    } catch (error) {
        console.error('Error seeding job_groups:', error);
        throw error;
    }
}



// async function seedJobs(client) {
//     try {
//         // Enable UUID extension if not already enabled
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the jobs table
//         const createTable = await client.query(`
//         CREATE TABLE IF NOT EXISTS jobs(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             position VARCHAR(255) NOT NULL UNIQUE,
//             station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
//             group_id UUID NOT NULL REFERENCES job_groups(id) ON DELETE CASCADE,
//             startDate VARCHAR(255) NOT NULL,
//             endDate VARCHAR(255) NOT NULL,
//             status VARCHAR(255) NOT NULL,
//             date DATE NOT NULL
//         );`);
//         console.log(`Created "jobs" table`);

//         // Insert data into the "jobs" table
//         const insertedJobs = await Promise.all(
//             jobs.map(async (job) => {
//                 return client.query(`
//                 INSERT INTO jobs (position, station_id, group_id, startDate, endDate, status, date)
//                 VALUES ($1, $2, $3, $4, $5, $6, $7)
//                 ON CONFLICT (position) DO NOTHING RETURNING *;`, 
//                 [job.position, job.station_id, job.group_id, job.startDate, job.endDate, job.status, job.date]);
//             }),
//         );
//         console.log(`Seeded ${insertedJobs.length} jobs`);
//         return {
//             createTable,
//             jobs: insertedJobs
//         };
//     } catch (error) {
//         console.error('Error seeding jobs', error);
//         throw error;
//     }
// }


async function seedJobs(client) {
    try {
        // Enable UUID extension if not already enabled
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await client.query(`DROP TRIGGER IF EXISTS update_jobs_timestamp ON jobs;`);

        // Create the jobs table with timestamp columns
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS jobs(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            position VARCHAR(255) NOT NULL UNIQUE,
            station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
            group_id UUID NOT NULL REFERENCES job_groups(id) ON DELETE CASCADE,
            startDate VARCHAR(255) NOT NULL,
            endDate VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);
        console.log(`Created "jobs" table`);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_jobs_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update on the "jobs" table
        await client.query(`
            CREATE TRIGGER update_jobs_timestamp
            BEFORE UPDATE ON jobs
            FOR EACH ROW
            EXECUTE FUNCTION update_jobs_timestamp();
        `);

        console.log(`Added trigger to update "updated_at" on jobs`);

        

        // Insert data into the "jobs" table
        const insertedJobs = await Promise.all(
            jobs.map(async (job) => {
                return client.query(`
                    INSERT INTO jobs (position, station_id, group_id, startDate, endDate, status, date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (position) DO NOTHING RETURNING *;
                `, [job.position, job.station_id, job.group_id, job.startDate, job.endDate, job.status, job.date]);
            }),
        );

        console.log(`Seeded ${insertedJobs.filter(Boolean).length} jobs`);

        return {
            createTable,
            jobs: insertedJobs.filter(Boolean)  // Filter out unsuccessful inserts
        };
    } catch (error) {
        console.error('Error seeding jobs:', error);
        throw error;
    }
}


// async function seedRequirements(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the "requirements" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS requirements (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 requirement TEXT NOT NULL,
//                 position_id UUID NOT NULL,
//                 group_id UUID NOT NULL
//             );
//         `);

//         console.log(`Created "requirements" table`);

//         // Insert data into the requirements table
//         const insertedRequirements = await Promise.all(
//             requirements.map(requirement => {
//                 return client.query(`
//                     INSERT INTO requirements (requirement, position_id, group_id)
//                     VALUES ($1, $2,


// async function seedRequirements(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the "requirements" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS requirements (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 requirement TEXT NOT NULL,
//                 position_id UUID NOT NULL,
//                 group_id UUID NOT NULL
//             );
//         `);

//         console.log(`Created "requirements" table`);

//         // Insert data into the requirements table
//         const insertedRequirements = await Promise.all(
//             requirements.map(requirement => {
//                 return client.query(`
//                     INSERT INTO requirements (requirement, position_id, group_id)
//                     VALUES ($1, $2, $3)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [requirement.requirement, requirement.position_id, requirement.group_id]);
//             })
//         );

//         console.log(`Seeded ${tedRequirements.length} requirements`);

//         return {
//             createTable,
//             requirements: insertedRequirements
//         };
//     } catch (error) {
//         console.error('Error seeding requirements:', error);
//         throw error;
//     }
// }


// async function seedRequirements(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the "requirements" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS requirements (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 requirement TEXT NOT NULL,
//                 position_id UUID NOT NULL,
//                 group_id UUID NOT NULL,
//                 CONSTRAINT unique_requirement_position UNIQUE (requirement, position_id) -- Add unique constraint here
//             );
//         `);

//         console.log(`Created "requirements" table`);

//         // Insert data into the requirements table
//         const insertedRequirements = await Promise.all(
//             requirements.map(requirement => {
//                 return client.query(`
//                     INSERT INTO requirements (requirement, position_id, group_id)
//                     VALUES ($1, $2, $3)
//                     ON CONFLICT (requirement, position_id) DO NOTHING RETURNING *;  -- Handle conflict based on unique constraint
//                 `, [requirement.requirement, requirement.position_id, requirement.group_id]);
//             })
//         );

//         console.log(`Seeded ${insertedRequirements.length} requirements`);

//         return {
//             createTable,
//             requirements: insertedRequirements
//         };
//     } catch (error) {
//         console.error('Error seeding requirements:', error);
//         throw error;
//     }
// }


async function seedRequirements(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);


        await client.query(`DROP TRIGGER IF EXISTS update_requirement_timestamp ON requirements;`);

        // Create the "requirements" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS requirements (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                requirement TEXT NOT NULL,
                position_id UUID NOT NULL,
                group_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_requirement_position UNIQUE (requirement, position_id) -- Add unique constraint here
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_requirement_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_requirement_timestamp
            BEFORE UPDATE ON requirements
            FOR EACH ROW
            EXECUTE FUNCTION update_requirement_timestamp();
        `);

        console.log(`Created "requirements" table with update timestamp trigger`);

        // Insert data into the requirements table
        const insertedRequirements = await Promise.all(
            requirements.map(requirement => {
                return client.query(`
                    INSERT INTO requirements (requirement, position_id, group_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (requirement, position_id) DO NOTHING RETURNING *;  -- Handle conflict based on unique constraint
                `, [requirement.requirement, requirement.position_id, requirement.group_id]);
            })
        );

        console.log(`Seeded ${insertedRequirements.filter(Boolean).length} requirements`);

        return {
            createTable,
            requirements: insertedRequirements.filter(Boolean)  // Filter out unsuccessful inserts
        };
    } catch (error) {
        console.error('Error seeding requirements:', error);
        throw error;
    }
}


// async function seedResponsibilities(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the "responsibilities" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS responsibilities (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 responsibility TEXT NOT NULL,
//                 position_id UUID NOT NULL,
//                 group_id UUID NOT NULL
//             );
//         `);

//         console.log(`Created "responsibilities" table`);

//         // Insert data into the responsibilities table
//         const insertedResponsibilities = await Promise.all(
//             responsibilities.map(responsibility => {
//                 return client.query(`
//                     INSERT INTO responsibilities (responsibility, position_id, group_id)
//                     VALUES ($1, $2, $3)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [responsibility.responsibility, responsibility.position_id, responsibility.group_id]);
//             })
//         );

//         console.log(`Seeded ${insertedResponsibilities.length} responsibilities`);

//         return {
//             createTable,
//             responsibilities: insertedResponsibilities
//         };
//     } catch (error) {
//         console.error('Error seeding responsibilities:', error);
//         throw error;
//     }
// }

// async function seedResponsibilities(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the "responsibilities" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS responsibilities (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 responsibility TEXT NOT NULL,
//                 position_id UUID NOT NULL,
//                 group_id UUID NOT NULL,
//                 CONSTRAINT unique_responsibility_position UNIQUE (responsibility, position_id)  -- Add unique constraint here
//             );
//         `);

//         console.log(`Created "responsibilities" table`);

//         // Insert data into the responsibilities table
//         const insertedResponsibilities = await Promise.all(
//             responsibilities.map(responsibility => {
//                 return client.query(`
//                     INSERT INTO responsibilities (responsibility, position_id, group_id)
//                     VALUES ($1, $2, $3)
//                     ON CONFLICT (responsibility, position_id) DO NOTHING RETURNING *;  -- Handle conflict based on unique constraint
//                 `, [responsibility.responsibility, responsibility.position_id, responsibility.group_id]);
//             })
//         );

//         console.log(`Seeded ${insertedResponsibilities.length} responsibilities`);

//         return {
//             createTable,
//             responsibilities: insertedResponsibilities
//         };
//     } catch (error) {
//         console.error('Error seeding responsibilities:', error);
//         throw error;
//     }
// }

async function seedResponsibilities(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await client.query(`DROP TRIGGER IF EXISTS update_responsibility_timestamp ON responsibilities;`);

        // Create the "responsibilities" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS responsibilities (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                responsibility TEXT NOT NULL,
                position_id UUID NOT NULL,
                group_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_responsibility_position UNIQUE (responsibility, position_id)  -- Add unique constraint here
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_responsibility_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_responsibility_timestamp
            BEFORE UPDATE ON responsibilities
            FOR EACH ROW
            EXECUTE FUNCTION update_responsibility_timestamp();
        `);

        console.log(`Created "responsibilities" table with update timestamp trigger`);

        // Insert data into the responsibilities table
        const insertedResponsibilities = await Promise.all(
            responsibilities.map(responsibility => {
                return client.query(`
                    INSERT INTO responsibilities (responsibility, position_id, group_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (responsibility, position_id) DO NOTHING RETURNING *;  -- Handle conflict based on unique constraint
                `, [responsibility.responsibility, responsibility.position_id, responsibility.group_id]);
            })
        );

        console.log(`Seeded ${insertedResponsibilities.filter(Boolean).length} responsibilities`);

        return {
            createTable,
            responsibilities: insertedResponsibilities.filter(Boolean)  // Filter out unsuccessful inserts
        };
    } catch (error) {
        console.error('Error seeding responsibilities:', error);
        throw error;
    }
}



// async function seedGender(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Create the "t_gender" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS t_gender (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//             );
//         `);

//         console.log(`Created "t_gender" table`);

//         // Insert data into the t_gender table
//         const insertedGenderValues = await Promise.all(
//             gender_values.map(genderValue => {
//                 return client.query(`
//                     INSERT INTO t_gender (name, description)
//                     VALUES ($1, $2)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [genderValue.name, genderValue.description]);
//             })
//         );

//         console.log(`Seeded ${insertedGenderValues.length} gender values`);

//         return {
//             createTable,
//             t_gender: insertedGenderValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_gender:', error);
//         throw error;
//     }
// }

async function seedGender(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);


        await client.query(`DROP TRIGGER IF EXISTS update_gender_timestamp ON t_gender;`);

        // Create the "t_gender" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_gender (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,  -- Add unique constraint on "name"
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_gender_timestamp
            BEFORE UPDATE ON t_gender
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_gender" table with update timestamp trigger`);

        // Insert data into the t_gender table
        const insertedGenderValues = await Promise.all(
            gender_values.map(async (genderValue) => {
                return client.query(`
                    INSERT INTO t_gender (name, description)
                    VALUES ($1, $2)
                    ON CONFLICT (name) DO NOTHING RETURNING *;
                `, [genderValue.name, genderValue.description]);
            })
        );

        console.log(`Seeded ${insertedGenderValues.filter(Boolean).length} gender values`);

        return {
            createTable,
            t_gender: insertedGenderValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_gender:', error);
        throw error;
    }
}


async function seedApplicationOrigin(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_application_origin_timestamp ON t_application_origin;`);

        // Create the "t_application_origin" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_application_origin (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                source VARCHAR(255) NOT NULL UNIQUE,  -- Add unique constraint on "source"
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_application_origin_timestamp
            BEFORE UPDATE ON t_application_origin
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_application_origin" table with update timestamp trigger`);

        // Insert data into the t_application_origin table
        const insertedApplicationOriginValues = await Promise.all(
            application_origin_values.map(async (applicationOriginValue) => {
                return client.query(`
                    INSERT INTO t_application_origin (source, description)
                    VALUES ($1, $2)
                    ON CONFLICT (source) DO NOTHING RETURNING *;
                `, [applicationOriginValue.source, applicationOriginValue.description]);
            })
        );

        console.log(`Seeded ${insertedApplicationOriginValues.filter(Boolean).length} application origin values`);

        return {
            createTable,
            t_application_origin: insertedApplicationOriginValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_application_origin:', error);
        throw error;
    }
}


async function seedCountry(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_country_timestamp ON t_country;`);

        // Create the "t_country" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_country (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,  -- Add unique constraint on "name"
                country_code VARCHAR(3) NOT NULL,    -- ISO 3166-1 alpha-3 code
                continent VARCHAR(255),
                region VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_country_timestamp
            BEFORE UPDATE ON t_country
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_country" table with update timestamp trigger`);

        // Insert data into the t_country table
        const insertedCountryValues = await Promise.all(
            country_values.map(async (countryValue) => {
                return client.query(`
                    INSERT INTO t_country (name, country_code, continent, region)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (name) DO NOTHING RETURNING *;
                `, [countryValue.name, countryValue.country_code, countryValue.continent, countryValue.region]);
            })
        );

        console.log(`Seeded ${insertedCountryValues.filter(Boolean).length} country values`);

        return {
            createTable,
            t_country: insertedCountryValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_country:', error);
        throw error;
    }
}



async function seedEducationLevel(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_education_level_timestamp ON t_education_level;`);

        // Create the "t_education_level" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_education_level (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                level VARCHAR(255) NOT NULL UNIQUE,  -- Add unique constraint on "level"
                abbreviation VARCHAR(50),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_education_level_timestamp
            BEFORE UPDATE ON t_education_level
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_education_level" table with update timestamp trigger`);

        // Insert data into the t_education_level table
        const insertedEducationLevelValues = await Promise.all(
            education_level_values.map(async (educationLevelValue) => {
                return client.query(`
                    INSERT INTO t_education_level (level, abbreviation, description)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (level) DO NOTHING RETURNING *;
                `, [educationLevelValue.level, educationLevelValue.abbreviation, educationLevelValue.description]);
            })
        );

        console.log(`Seeded ${insertedEducationLevelValues.filter(Boolean).length} education level values`);

        return {
            createTable,
            t_education_level: insertedEducationLevelValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_education_level:', error);
        throw error;
    }
}


async function seedLanguages(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_language_timestamp ON t_language;`);

        // Create the "t_language" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_language (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE, -- Make language name unique
                language_code VARCHAR(10), -- ISO 639-1 or ISO 639-2 code
                native_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_language_timestamp
            BEFORE UPDATE ON t_language
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_language" table with update timestamp trigger`);

        // Insert data into the t_language table
        const insertedLanguagesValues = await Promise.all(
            languages_values.map(async (languagesValue) => {
                return client.query(`
                    INSERT INTO t_language (name, language_code, native_name)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (name) DO NOTHING RETURNING *;
                `, [languagesValue.name, languagesValue.language_code, languagesValue.native_name]);
            })
        );

        console.log(`Seeded ${insertedLanguagesValues.filter(Boolean).length} language values`);

        return {
            createTable,
            t_language: insertedLanguagesValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_language:', error);
        throw error;
    }
}


// async function seedCandidateInformation(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Drop any existing trigger for updating timestamps
//         await client.query(`DROP TRIGGER IF EXISTS update_candidate_information_timestamp ON t_candidate_information;`);

//         // Create the "t_candidate_information" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS t_candidate_information (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 positionid UUID NOT NULL,
//                 genderid UUID NOT NULL,
//                 fullname VARCHAR(255) NOT NULL,
//                 firstname VARCHAR(255) NOT NULL,
//                 permanentaddress VARCHAR(255) NOT NULL,
//                 postalcode VARCHAR(255) NOT NULL,
//                 city VARCHAR(255) NOT NULL,
//                 countryofresidence UUID NOT NULL,
//                 phone VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) NOT NULL,
//                 languageid UUID NOT NULL,
//                 applicationoriginid UUID NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//                 FOREIGN KEY (positionid) REFERENCES jobs(id),
//                 FOREIGN KEY (genderid) REFERENCES t_gender(id),
//                 FOREIGN KEY (countryofresidence) REFERENCES t_country(id),
//                 FOREIGN KEY (languageid) REFERENCES t_language(id),
//                 FOREIGN KEY (applicationoriginid) REFERENCES t_application_origin(id)
//             );
//         `);

//         // Create a trigger function to automatically update the `updated_at` column
//         await client.query(`
//             CREATE OR REPLACE FUNCTION update_timestamp()
//             RETURNS TRIGGER AS $$
//             BEGIN
//                 NEW.updated_at = NOW();
//                 RETURN NEW;
//             END;
//             $$ LANGUAGE plpgsql;
//         `);

//         // Create a trigger that calls the function before any update
//         await client.query(`
//             CREATE TRIGGER update_candidate_information_timestamp
//             BEFORE UPDATE ON t_candidate_information
//             FOR EACH ROW
//             EXECUTE FUNCTION update_timestamp();
//         `);

//         console.log(`Created "t_candidate_information" table with update timestamp trigger`);

//         // Insert data into t_candidate_information table
//         const insertedCandidateInformationValues = await Promise.all(
//             candidate_information_values.map(async (candidateInformationValue) => {
//                 return client.query(`
//                     INSERT INTO t_candidate_information (positionid, genderid, fullname, firstname, permanentaddress, postalcode, city, countryofresidence, phone, email, languageid, applicationoriginid)
//                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [
//                     candidateInformationValue.positionid,
//                     candidateInformationValue.genderid,
//                     candidateInformationValue.fullname,
//                     candidateInformationValue.firstname,
//                     candidateInformationValue.permanentaddress,
//                     candidateInformationValue.postalcode,
//                     candidateInformationValue.city,
//                     candidateInformationValue.countryofresidence,
//                     candidateInformationValue.phone,
//                     candidateInformationValue.email,
//                     candidateInformationValue.languageid,
//                     candidateInformationValue.applicationoriginid
//                 ]);
//             })
//         );

//         console.log(`Seeded ${insertedCandidateInformationValues.filter(Boolean).length} t_candidate_information`);

//         return {
//             createTable,
//             t_candidate_information: insertedCandidateInformationValues.filter(Boolean)
//         };
//     } catch (error) {
//         console.error('Error seeding t_candidate_information:', error);
//         throw error;
//     }
// }

async function seedCandidateInformation(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_candidate_information_timestamp ON t_candidate_information;`);




        // Create the "t_candidate_information" table with a unique constraint on (positionid, email)
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_candidate_information (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                positionid UUID NOT NULL,
                genderid UUID NOT NULL,
                fullname VARCHAR(255) NOT NULL,
                firstname VARCHAR(255) NOT NULL,
                permanentaddress VARCHAR(255) NOT NULL,
                postalcode VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                countryofresidence UUID NOT NULL,
                phone VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                languageid UUID NOT NULL,
                applicationoriginid UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (positionid) REFERENCES jobs(id),
                FOREIGN KEY (genderid) REFERENCES t_gender(id),
                FOREIGN KEY (countryofresidence) REFERENCES t_country(id),
                FOREIGN KEY (languageid) REFERENCES t_language(id),
                FOREIGN KEY (applicationoriginid) REFERENCES t_application_origin(id),
                CONSTRAINT unique_position_email UNIQUE (positionid, email)  -- Unique constraint to avoid duplication of applications for the same job
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_candidate_information_timestamp
            BEFORE UPDATE ON t_candidate_information
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_candidate_information" table with a unique position-email constraint and update timestamp trigger`);

        // Insert data into t_candidate_information table
        const insertedCandidateInformationValues = await Promise.all(
            candidate_information_values.map(async (candidateInformationValue) => {
                return client.query(`
                    INSERT INTO t_candidate_information (positionid, genderid, fullname, firstname, permanentaddress, postalcode, city, countryofresidence, phone, email, languageid, applicationoriginid)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    ON CONFLICT (positionid, email) DO NOTHING RETURNING *;  -- Prevent duplicate applications for the same job
                `, [
                    candidateInformationValue.positionid,
                    candidateInformationValue.genderid,
                    candidateInformationValue.fullname,
                    candidateInformationValue.firstname,
                    candidateInformationValue.permanentaddress,
                    candidateInformationValue.postalcode,
                    candidateInformationValue.city,
                    candidateInformationValue.countryofresidence,
                    candidateInformationValue.phone,
                    candidateInformationValue.email,
                    candidateInformationValue.languageid,
                    candidateInformationValue.applicationoriginid
                ]);
            })
        );

        console.log(`Seeded ${insertedCandidateInformationValues.filter(Boolean).length} t_candidate_information`);

        return {
            createTable,
            t_candidate_information: insertedCandidateInformationValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_candidate_information:', error);
        throw error;
    }
}


async function seedDegreeName(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await client.query(`DROP TRIGGER IF EXISTS update_degree_name_timestamp ON t_degree_name;`);

        // Create the "t_degree_name" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_degree_name (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE, -- Add unique constraint on "name"
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_degree_name_timestamp
            BEFORE UPDATE ON t_degree_name
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_degree_name" table with update timestamp trigger`);

        // Insert data into the t_degree_name table
        const insertedDegreeNameValues = await Promise.all(
            degree_name_values.map(async (degreeNameValue) => {
                return client.query(`
                    INSERT INTO t_degree_name (name)
                    VALUES ($1)
                    ON CONFLICT (name) DO NOTHING RETURNING *;
                `, [degreeNameValue.name]);
            })
        );

        console.log(`Seeded ${insertedDegreeNameValues.filter(Boolean).length} degree name values`);

        return {
            createTable,
            t_degree_name: insertedDegreeNameValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_degree_name:', error);
        throw error;
    }
}



async function seedApplicantEducation(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await client.query(`DROP TRIGGER IF EXISTS update_applicant_education_timestamp ON t_applicant_education;`);

        // Create the "t_applicant_education" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_applicant_education (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                applicant_id UUID NOT NULL,
                education_level_id UUID NOT NULL,
                degree_name_id UUID,
                start_date DATE,
                end_date DATE,
                institution_name VARCHAR(255),
                is_highest_level BOOLEAN NOT NULL DEFAULT false, -- Boolean to track highest level
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_applicant_education_timestamp
            BEFORE UPDATE ON t_applicant_education
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        // Add foreign keys to related tables
        await client.query(`
            ALTER TABLE t_applicant_education
            ADD CONSTRAINT fk_applicant
            FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id) ON DELETE CASCADE,
            
            ADD CONSTRAINT fk_education_level
            FOREIGN KEY (education_level_id) REFERENCES t_education_level(id),
            
            ADD CONSTRAINT fk_degree_name
            FOREIGN KEY (degree_name_id) REFERENCES t_degree_name(id);
        `);

        console.log(`Created "t_applicant_education" table with update timestamp trigger`);

        // Insert data into the t_applicant_education table
        const insertedApplicantEducationValues = await Promise.all(
            applicant_education_values.map(async (applicantEducationValue) => {
                return client.query(`
                    INSERT INTO t_applicant_education (
                        applicant_id, education_level_id, degree_name_id, start_date, end_date, 
                        institution_name, is_highest_level
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (id) DO NOTHING RETURNING *;
                `, [
                    applicantEducationValue.applicant_id,
                    applicantEducationValue.education_level_id,
                    applicantEducationValue.degree_name_id,
                    applicantEducationValue.start_date,
                    applicantEducationValue.end_date,
                    applicantEducationValue.institution_name,
                    applicantEducationValue.is_highest_level
                ]);
            })
        );

        console.log(`Seeded ${insertedApplicantEducationValues.filter(Boolean).length} applicant education records`);

        return {
            createTable,
            t_applicant_education: insertedApplicantEducationValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_applicant_education:', error);
        throw error;
    }
}


// async function seedExperience(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Drop any existing trigger for updating timestamps
//         await client.query(`DROP TRIGGER IF EXISTS update_experience_timestamp ON t_experience;`);

//         // Create the "t_experience" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS t_experience (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 applicant_id UUID NOT NULL,
//                 job_title VARCHAR(255) NOT NULL,
//                 company_name VARCHAR(255) NOT NULL,
//                 start_date DATE NOT NULL,
//                 end_date DATE,
//                 description TEXT,
//                 current_workplace BOOLEAN NOT NULL DEFAULT false,  -- Defines if the applicant is still working at the company
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//             );
//         `);

//         // Create a trigger function to automatically update the `updated_at` column
//         await client.query(`
//             CREATE OR REPLACE FUNCTION update_timestamp()
//             RETURNS TRIGGER AS $$
//             BEGIN
//                 NEW.updated_at = NOW();
//                 RETURN NEW;
//             END;
//             $$ LANGUAGE plpgsql;
//         `);

//         // Create a trigger that calls the function before any update
//         await client.query(`
//             CREATE TRIGGER update_experience_timestamp
//             BEFORE UPDATE ON t_experience
//             FOR EACH ROW
//             EXECUTE FUNCTION update_timestamp();
//         `);

//         console.log(`Created "t_experience" table with update timestamp trigger`);

//         // Insert data into the t_experience table
//         const insertedExperienceValues = await Promise.all(
//             experience_values.map(async (experienceValue) => {
//                 return client.query(`
//                     INSERT INTO t_experience (applicant_id, job_title, company_name, start_date, end_date, description, current_workplace)
//                     VALUES ($1, $2, $3, $4, $5, $6, $7)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [
//                     experienceValue.applicant_id,
//                     experienceValue.job_title,
//                     experienceValue.company_name,
//                     experienceValue.start_date,
//                     experienceValue.end_date,
//                     experienceValue.description,
//                     experienceValue.current_workplace
//                 ]);
//             })
//         );

//         console.log(`Seeded ${insertedExperienceValues.filter(Boolean).length} experience values`);

//         return {
//             createTable,
//             t_experience: insertedExperienceValues.filter(Boolean)
//         };
//     } catch (error) {
//         console.error('Error seeding t_experience:', error);
//         throw error;
//     }
// }


async function seedExperience(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_experience_timestamp ON t_experience;`);

        // Create the "t_experience" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_experience (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                applicant_id UUID NOT NULL,
                job_title VARCHAR(255) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE,
                description TEXT,
                current_workplace BOOLEAN NOT NULL DEFAULT false,  -- Defines if the applicant is still working at the company
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id),
                -- Add unique constraint to prevent duplicate experience (same applicant_id and job_title)
                UNIQUE (applicant_id, job_title)
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_experience_timestamp
            BEFORE UPDATE ON t_experience
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_experience" table with unique constraint and update timestamp trigger`);

        // Insert data into the t_experience table
        const insertedExperienceValues = await Promise.all(
            experience_values.map(async (experienceValue) => {
                return client.query(`
                    INSERT INTO t_experience (applicant_id, job_title, company_name, start_date, end_date, description, current_workplace)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (applicant_id, job_title) DO NOTHING RETURNING *;
                `, [
                    experienceValue.applicant_id,
                    experienceValue.job_title,
                    experienceValue.company_name,
                    experienceValue.start_date,
                    experienceValue.end_date,
                    experienceValue.description,
                    experienceValue.current_workplace
                ]);
            })
        );

        console.log(`Seeded ${insertedExperienceValues.filter(Boolean).length} experience values`);

        return {
            createTable,
            t_experience: insertedExperienceValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_experience:', error);
        throw error;
    }
}



// async function seedResumes(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Drop any existing trigger for updating timestamps
//         await client.query(`DROP TRIGGER IF EXISTS update_resume_timestamp ON t_resumes;`);

//         // Create the "t_resumes" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS t_resumes (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 url VARCHAR(255) NOT NULL,
//                 applicant_id UUID NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//             );
//         `);

//         // Create a trigger function to automatically update the `updated_at` column
//         await client.query(`
//             CREATE OR REPLACE FUNCTION update_timestamp()
//             RETURNS TRIGGER AS $$
//             BEGIN
//                 NEW.updated_at = NOW();
//                 RETURN NEW;
//             END;
//             $$ LANGUAGE plpgsql;
//         `);

//         // Create a trigger that calls the function before any update
//         await client.query(`
//             CREATE TRIGGER update_resume_timestamp
//             BEFORE UPDATE ON t_resumes
//             FOR EACH ROW
//             EXECUTE FUNCTION update_timestamp();
//         `);

//         console.log(`Created "t_resumes" table with update timestamp trigger`);

//         // Insert data into the t_resumes table
//         const insertedResumeValues = await Promise.all(
//             resume_values.map(async (resumeValue) => {
//                 return client.query(`
//                     INSERT INTO t_resumes (name, url, applicant_id)
//                     VALUES ($1, $2, $3)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [
//                     resumeValue.name,
//                     resumeValue.url,
//                     resumeValue.applicant_id
//                 ]);
//             })
//         );

//         console.log(`Seeded ${insertedResumeValues.filter(Boolean).length} resume values`);

//         return {
//             createTable,
//             t_resumes: insertedResumeValues.filter(Boolean)
//         };
//     } catch (error) {
//         console.error('Error seeding t_resumes:', error);
//         throw error;
//     }
// }

async function seedResumes(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_resume_timestamp ON t_resumes;`);

        // Create the "t_resumes" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_resumes (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url VARCHAR(255) NOT NULL,
                applicant_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id),
                -- Add unique constraint to prevent duplicate resumes (same name and applicant_id)
                UNIQUE (name, applicant_id)
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_resume_timestamp
            BEFORE UPDATE ON t_resumes
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_resumes" table with unique constraint and update timestamp trigger`);

        // Insert data into the t_resumes table
        const insertedResumeValues = await Promise.all(
            resume_values.map(async (resumeValue) => {
                return client.query(`
                    INSERT INTO t_resumes (name, url, applicant_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (name, applicant_id) DO NOTHING RETURNING *;  -- Handle conflict based on name and applicant_id
                `, [
                    resumeValue.name,
                    resumeValue.url,
                    resumeValue.applicant_id
                ]);
            })
        );

        console.log(`Seeded ${insertedResumeValues.filter(Boolean).length} resume values`);

        return {
            createTable,
            t_resumes: insertedResumeValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_resumes:', error);
        throw error;
    }
}

// async function seedCoverLetters(client) {
//     try {
//         // Ensure uuid-ossp extension is available for UUID generation
//         await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

//         // Drop any existing trigger for updating timestamps
//         await client.query(`DROP TRIGGER IF EXISTS update_cover_letter_timestamp ON t_cover_letter;`);

//         // Create the "t_cover_letter" table if it doesn't already exist
//         const createTable = await client.query(`
//             CREATE TABLE IF NOT EXISTS t_cover_letter (
//                 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 url VARCHAR(255) NOT NULL,
//                 applicant_id UUID NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//             );
//         `);

//         // Create a trigger function to automatically update the `updated_at` column
//         await client.query(`
//             CREATE OR REPLACE FUNCTION update_timestamp()
//             RETURNS TRIGGER AS $$
//             BEGIN
//                 NEW.updated_at = NOW();
//                 RETURN NEW;
//             END;
//             $$ LANGUAGE plpgsql;
//         `);

//         // Create a trigger that calls the function before any update
//         await client.query(`
//             CREATE TRIGGER update_cover_letter_timestamp
//             BEFORE UPDATE ON t_cover_letter
//             FOR EACH ROW
//             EXECUTE FUNCTION update_timestamp();
//         `);

//         console.log(`Created "t_cover_letter" table with update timestamp trigger`);

//         // Insert data into the t_cover_letter table
//         const insertedCoverLetterValues = await Promise.all(
//             cover_letter_values.map(async (coverLetterValue) => {
//                 return client.query(`
//                     INSERT INTO t_cover_letter (name, url, applicant_id)
//                     VALUES ($1, $2, $3)
//                     ON CONFLICT (id) DO NOTHING RETURNING *;
//                 `, [
//                     coverLetterValue.name,
//                     coverLetterValue.url,
//                     coverLetterValue.applicant_id
//                 ]);
//             })
//         );

//         console.log(`Seeded ${insertedCoverLetterValues.filter(Boolean).length} cover letter values`);

//         return {
//             createTable,
//             t_cover_letter: insertedCoverLetterValues.filter(Boolean)
//         };
//     } catch (error) {
//         console.error('Error seeding t_cover_letter:', error);
//         throw error;
//     }
// }

async function seedCoverLetters(client) {
    try {
        // Ensure uuid-ossp extension is available for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop any existing trigger for updating timestamps
        await client.query(`DROP TRIGGER IF EXISTS update_cover_letter_timestamp ON t_cover_letter;`);

        // Create the "t_cover_letter" table if it doesn't already exist
        const createTable = await client.query(`
            CREATE TABLE IF NOT EXISTS t_cover_letter (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url VARCHAR(255) NOT NULL,
                applicant_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id),
                -- Add unique constraint to prevent duplicate cover letters (same name and applicant_id)
                UNIQUE (name, applicant_id)
            );
        `);

        // Create a trigger function to automatically update the `updated_at` column
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create a trigger that calls the function before any update
        await client.query(`
            CREATE TRIGGER update_cover_letter_timestamp
            BEFORE UPDATE ON t_cover_letter
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log(`Created "t_cover_letter" table with unique constraint and update timestamp trigger`);

        // Insert data into the t_cover_letter table
        const insertedCoverLetterValues = await Promise.all(
            cover_letter_values.map(async (coverLetterValue) => {
                return client.query(`
                    INSERT INTO t_cover_letter (name, url, applicant_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (name, applicant_id) DO NOTHING RETURNING *;  -- Handle conflict based on name and applicant_id
                `, [
                    coverLetterValue.name,
                    coverLetterValue.url,
                    coverLetterValue.applicant_id
                ]);
            })
        );

        console.log(`Seeded ${insertedCoverLetterValues.filter(Boolean).length} cover letter values`);

        return {
            createTable,
            t_cover_letter: insertedCoverLetterValues.filter(Boolean)
        };
    } catch (error) {
        console.error('Error seeding t_cover_letter:', error);
        throw error;
    }
}





async function main() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your environment
    });

    try {


        await client.connect();
        await seedUsers(client);
        await seedStations(client);
        await seedJobGroups(client);
        await seedRequirements(client);
        await seedJobs(client);
        await seedResponsibilities(client);
        await seedGender(client);
        await seedApplicationOrigin(client);
        await seedCountry(client);
        await seedEducationLevel(client);
        await seedLanguages(client);
        await seedCandidateInformation(client);
        await seedDegreeName(client);
        await seedApplicantEducation(client);
        await seedExperience(client);
        await seedResumes(client);
        await seedCoverLetters(client);




    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});






