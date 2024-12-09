const { db } = require('@vercel/postgres');

//import { sql } from '@/scripts/db';
 
//export const dynamic = 'force-dynamic';


const {
    users,
    groups,
    terms,
    jobs,
    requirements,
    stations,
    requirement_values,
    requirement_types,
    gender_values,
    country_values,
    languages_values,
    experience_values,
    application_origin_values,
    candidate_information_values,
    resume_values,
    cover_letter_values,
    nationality_values,
    education_level_values,
    degree_name_values,
    subject_name_values,
    applicant_education_values
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
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
            users.map(async (user) => {
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
    } catch (error) {
        console.error('Error seeding users', error);
        throw error;
    }
}


// async function seedStations(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         //Create the users table
//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS stations(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             station VARCHAR(255) NOT NULL UNIQUE
//         );`;
//         console.log(`Created "stations" table`);

//         //Insert data into the "users" table
//         const insertedStations = await Promise.all(
//             stations.map(async (station) => {

//                 return client.sql`
//                 INSERT INTO stations (id,station)
//                 VALUES (${station.id},${station.station})
//                 ON CONFLICT (id) DO NOTHING;`;
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


// async function seedJobGroups(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         //Create the users table
//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS job_groups(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             job_group VARCHAR(255) NOT NULL UNIQUE
//         );`;
//         console.log(`Created "job_group" table`);

//         //Insert data into the "users" table
//         const insertedJopGroup = await Promise.all(
//             groups.map(async (jobgroup) => {

//                 return client.sql`
//                 INSERT INTO job_groups (id,job_group)
//                 VALUES (${jobgroup.id},${jobgroup.job_group})
//                 ON CONFLICT (id) DO NOTHING;`;
//             }),
//         );
//         console.log(`Seeded ${insertedJopGroup.length} stations`);
//         return {
//             createTable,
//             jobGroups: insertedJopGroup
//         };
//     } catch (error) {
//         console.error('Error seeding jobgroups', error);
//         throw error;
//     }
// }

// async function seedTerms(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         //Create the terms table
//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS terms(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             term VARCHAR(255) NOT NULL UNIQUE
//         );`;
//         console.log(`Created "terms" table`);

//         //Insert data into the "terms" table
//         const insertedTerms = await Promise.all(
//             terms.map(async (term) => {

//                 return client.sql`
//                 INSERT INTO terms (id,term)
//                 VALUES (${term.id},${term.term})
//                 ON CONFLICT (id) DO NOTHING;`;
//             }),
//         );
//         console.log(`Seeded ${insertedTerms.length} terms`);
//         return {
//             createTable,
//             terms: insertedTerms
//         };
//     } catch (error) {
//         console.error('Error seeding terms', error);
//         throw error;
//     }
// }

// async function seedJobs(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS jobs(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             position VARCHAR(255) NOT NULL UNIQUE,
//             station_id UUID NOT NULL,
//             group_id UUID NOT NULL,
//             term_id UUID NOT NULL,
//             period VARCHAR(255) NOT NULL,
//             startDate VARCHAR(255) NOT NULL,
//             endDate VARCHAR(255) NOT NULL,
//             status VARCHAR(255) NOT NULL,
//             date DATE NOT NULL
//         );

//         `;

//         console.log(`Created "jobs" table`);

//         const insertedJobs = await Promise.all(
//             jobs.map(
//                 (job) => client.sql`
//                 INSERT INTO jobs (id,position, station_id,group_id,term_id,period,startDate,endDate,status,date)
//                 VALUES (${job.id},${job.position},${job.station_id},${job.group_id},${job.term_id},${job.period},${job.startDate},${job.endDate},${job.status}, ${job.date})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedJobs.length} jobs`);
//         return {
//             createTable,
//             jobs: insertedJobs
//         };
//     } catch (error) {
//         console.error('Error seeding jobs:', error);
//         throw error;
//     }
// }

// async function seedRequirementType(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS requirement_types(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             requirement_type VARCHAR(255) NOT NULL
//         );
//         `;

//         console.log(`Created "requirement_types" table`);

//         const insertedRequirementTypes = await Promise.all(
//             requirement_types.map(
//                 (requirement_type) => client.sql`
//                 INSERT INTO requirement_types (id,requirement_type)
//                 VALUES (${requirement_type.id},${requirement_type.requirement_type})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedRequirementTypes.length} requirement_types`);
//         return {
//             createTable,
//             requirement_types: insertedRequirementTypes
//         };
//     } catch (error) {
//         console.error('Error seeding requirement_types:', error);
//         throw error;
//     }
// }

// async function seedRequirements(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS requirements(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             requirement TEXT NOT NULL,
//             position_id UUID NOT NULL,
//             group_id UUID NOT NULL,
//             rqtype_id UUID NOT NULL
//         );
//         `;

//         console.log(`Created "requirements" table`);

//         const insertedRequirements = await Promise.all(
//             requirements.map(
//                 (requirement) => client.sql`
//                 INSERT INTO requirements (id,requirement, position_id,group_id,rqtype_id)
//                 VALUES (${requirement.id},${requirement.requirement},${requirement.position_id}, ${requirement.group_id},${requirement.rqtype_id})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
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



// async function seedRequirementValues(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS requirement_values(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             requirement_value VARCHAR(255) NOT NULL,
//             requirement_id UUID NOT NULL
//         );
//         `;

//         console.log(`Created "requirement_values" table`);

//         const insertedRequirementValues = await Promise.all(
//             requirement_values.map(
//                 (requirementValue) => client.sql`
//                 INSERT INTO requirement_values (requirement_value, requirement_id)
//                 VALUES (${requirementValue.requirement_value},${requirementValue.requirement_id})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedRequirementValues.length} requirement_values`);
//         return {
//             createTable,
//             requirement_values: insertedRequirementValues
//         };
//     } catch (error) {
//         console.error('Error seeding requirement_values:', error);
//         throw error;
//     }
// }

// //Working on candidate Information



// async function seedGender(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_gender (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             description TEXT,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

//         );

//         `;

//         console.log(`Created "t_gender" table`);

//         const insertedGenderValues = await Promise.all(
//             gender_values.map(
//                 (genderValue) => client.sql`
//                 INSERT INTO t_gender (name, description)
//                 VALUES (${genderValue.name}, ${genderValue.description})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedGenderValues.length} t_gender`);
//         return {
//             createTable,
//             t_gender: insertedGenderValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_gender:', error);
//         throw error;
//     }
// }



// async function seedCountry(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_country (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             country_code VARCHAR(3) NOT NULL, -- ISO 3166-1 alpha-3 code
//             continent VARCHAR(255),
//             region VARCHAR(255),
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         );

//         `;

//         console.log(`Created "t_country" table`);

//         const insertedCountryValues = await Promise.all(
//             country_values.map(
//                 (countryValue) => client.sql`
//                 INSERT INTO t_country (name, country_code, continent, region)
//                 VALUES (${countryValue.name},${countryValue.country_code},${countryValue.continent},${countryValue.region})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedCountryValues.length} t_country`);
//         return {
//             createTable,
//             t_country: insertedCountryValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_country:', error);
//         throw error;
//     }
// }



// async function seedLanguages(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_language (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             language_code VARCHAR(10), -- ISO 639-1 or ISO 639-2 code
//             native_name VARCHAR(255),
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         );

//         `;

//         console.log(`Created "t_language" table`);

//         const insertedLanguagesValues = await Promise.all(
//             languages_values.map(
//                 (languagesValue) => client.sql`
//                 INSERT INTO t_language (name,language_code,native_name)
//                 VALUES (${languagesValue.name},${languagesValue.language_code},${languagesValue.native_name})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );

//         console.log(`Seeded ${insertedLanguagesValues.length} t_language`);
//         return {
//             createTable,
//             t_language: insertedLanguagesValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_language:', error);
//         throw error;
//     }
// }


// async function seedEducationLevel(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_education_level (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             level VARCHAR(255) NOT NULL,
//             abbreviation VARCHAR(50),
//             description TEXT
//         );

//         `;

//         console.log(`Created "t_education_level" table`);

//         const insertedEducationLevelValues = await Promise.all(
//             education_level_values.map(
//                 (educationLevelValue) => client.sql`
//                 INSERT INTO t_education_level (level, abbreviation, description)
//                 VALUES (${educationLevelValue.level},${educationLevelValue.abbreviation},${educationLevelValue.description})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedEducationLevelValues.length} t_education_level`);
//         return {
//             createTable,
//             t_education_level: insertedEducationLevelValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_education_level:', error);
//         throw error;
//     }
// }

// async function seedDegreeName(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_degree_name (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL
//         );


//         `;

//         console.log(`Created "t_degree_name" table`);

//         const insertedDegreeNameValues = await Promise.all(
//             degree_name_values.map(
//                 (degreeNameValue) => client.sql`
//                 INSERT INTO t_degree_name (name)
//                 VALUES (${degreeNameValue.name})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedDegreeNameValues.length} t_degree_name`);
//         return {
//             createTable,
//             t_degree_name: insertedDegreeNameValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_degree_name:', error);
//         throw error;
//     }
// }

// async function seedSubject(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_subject (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL
//         );


//         `;

//         console.log(`Created "t_subject" table`);

//         const insertedSubjectValues = await Promise.all(
//             subject_name_values.map(
//                 (subjectValue) => client.sql`
//                 INSERT INTO t_subject (name)
//                 VALUES (${subjectValue.name})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedSubjectValues.length} t_subject`);
//         return {
//             createTable,
//             t_subject: insertedSubjectValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_subject:', error);
//         throw error;
//     }
// }



// async function seedApplicantEducation(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_applicant_education (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         applicant_id UUID NOT NULL,
//         education_level_id UUID NOT NULL,
//         degree_name_id UUID,
//         subject_id UUID,
//         start_date DATE,
//         end_date DATE,
//         institution_name VARCHAR(255),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id),
//         FOREIGN KEY (education_level_id) REFERENCES t_education_level(id),
//         FOREIGN KEY (degree_name_id) REFERENCES t_degree_name(id),
//         FOREIGN KEY (subject_id) REFERENCES t_subject(id)
//     );


//         `;

//         console.log(`Created "t_applicant_education" table`);

//         const insertedApplicantEducationValues = await Promise.all(
//             applicant_education_values.map(
//                 (applicantEducationValue) => client.sql`
//                 INSERT INTO t_applicant_education ( applicant_id,education_level_id,
//                 degree_name_id,subject_id, start_date,end_date,institution_name)
//                 VALUES (${applicantEducationValue.applicant_id},${applicantEducationValue.education_level_id},
//                 ${applicantEducationValue.degree_name_id},${applicantEducationValue.subject_id},
//                 ${applicantEducationValue.start_date},${applicantEducationValue.end_date},
//                 ${applicantEducationValue.institution_name})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedApplicantEducationValues.length} t_applicant_education`);
//         return {
//             createTable,
//             t_applicant_education: insertedApplicantEducationValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_applicant_education:', error);
//         throw error;
//     }
// }


// async function seedExperience(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_experience (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             applicant_id UUID NOT NULL,
//             job_title VARCHAR(255) NOT NULL,
//             company_name VARCHAR(255) NOT NULL,
//             start_date DATE NOT NULL,
//             end_date DATE,
//             description TEXT,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//         );

//         `;

//         console.log(`Created "t_experience" table`);

//         const insertedExperienceValues = await Promise.all(
//             experience_values.map(
//                 (experienceValue) => client.sql`
//                 INSERT INTO t_experience (applicant_id,job_title,company_name,start_date,end_date,description)
//                 VALUES (${experienceValue.applicant_id},${experienceValue.job_title},${experienceValue.company_name},
//                 ${experienceValue.start_date},${experienceValue.end_date},${experienceValue.description})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedExperienceValues.length} t_experience`);
//         return {
//             createTable,
//             t_experience: insertedExperienceValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_experience:', error);
//         throw error;
//     }
// }


// async function seedApplicationOrigin(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_application_origin (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             source VARCHAR(255) NOT NULL,
//             description TEXT,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         );

//         `;

//         console.log(`Created "t_application_origin" table`);

//         const insertedApplicationOriginValues = await Promise.all(
//             application_origin_values.map(
//                 (applicationOriginValue) => client.sql`
//                 INSERT INTO t_application_origin (source,description)
//                 VALUES (${applicationOriginValue.source},${applicationOriginValue.description})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedApplicationOriginValues.length} t_application_origin`);
//         return {
//             createTable,
//             t_application_origin: insertedApplicationOriginValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_application_origin:', error);
//         throw error;
//     }
// }

// async function seedCandidateInformation(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_candidate_information (
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             positionid UUID NOT NULL,
//             genderid UUID NOT NULL,
//             fullname VARCHAR(255) NOT NULL,
//             firstname VARCHAR(255) NOT NULL,
//             permanentaddress VARCHAR(255) NOT NULL,
//             postalcode VARCHAR(255) NOT NULL,
//             city VARCHAR(255) NOT NULL,
//             countryofresidence UUID NOT NULL,
//             phone VARCHAR(255) NOT NULL,
//             email VARCHAR(255) NOT NULL,
//             languageid1 UUID NOT NULL,
//             languageid2 UUID NOT NULL,
//             applicationoriginid UUID NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (positionid) REFERENCES jobs(id),
//             FOREIGN KEY (genderid) REFERENCES t_gender(id),
//             FOREIGN KEY (countryofresidence) REFERENCES t_country(id),
//             FOREIGN KEY (languageid1) REFERENCES t_language(id),
//             FOREIGN KEY (languageid2) REFERENCES t_language(id),
//             FOREIGN KEY (applicationoriginid) REFERENCES t_application_origin(id) 

            
//         );


//         `;

//         console.log(`Created "t_candidate_information" table`);

//         const insertedCandidateInformationValues = await Promise.all(
//             candidate_information_values.map(
//                 (candidateInformationValue) => client.sql`
//                 INSERT INTO t_candidate_information (genderid, fullname, 
//                 firstname, permanentaddress, postalcode, city, countryofresidence, 
//                 phone, email, languageid1, languageid2, applicationoriginid)
//                 VALUES (${candidateInformationValue.genderid},${candidateInformationValue.fullname},
//                 ${candidateInformationValue.firstname},${candidateInformationValue.permanentaddress},
//                 ${candidateInformationValue.postalcode},${candidateInformationValue.city},
//                 ${candidateInformationValue.countryofresidence},${candidateInformationValue.phone},
//                 ${candidateInformationValue.email},${candidateInformationValue.languageid1},
//                 ${candidateInformationValue.languageid2},${candidateInformationValue.applicationoriginid})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedCandidateInformationValues.length} t_candidate_information`);
//         return {
//             createTable,
//             t_candidate_information: insertedCandidateInformationValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_candidate_information:', error);
//         throw error;
//     }
// }




// async function seedNationality(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_nationalities(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             countryid UUID NOT NULL,
//             applicant_id UUID NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (countryid) REFERENCES t_country(id),
//             FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//         );
//         `;

//         console.log(`Created "t_nationalities" table`);

//         const insertedNationalityValues = await Promise.all(
//             nationality_values.map(
//                 (nationalityValue) => client.sql`
//                 INSERT INTO t_nationalities (countryid, applicant_id)
//                 VALUES (${nationalityValue.countryid}, ${nationalityValue.applicant_id})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedNationalityValues.length} t_nationalities`);
//         return {
//             createTable,
//             t_nationalities: insertedNationalityValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_nationalities:', error);
//         throw error;
//     }
// }



// async function seedResumes(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_resumes(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             url VARCHAR(255) NOT NULL,
//             applicant_id UUID NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//         );
//         `;

//         console.log(`Created "t_resumes" table`);

//         const insertedResumeValues = await Promise.all(
//             resume_values.map(
//                 (resumeValue) => client.sql`
//                 INSERT INTO t_resumes (name, url, applicant_id)
//                 VALUES (${resumeValue.name}, ${resumeValue.url}, ${resumeValue.applicant_id})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedResumeValues.length} t_resumes`);
//         return {
//             createTable,
//             t_resumes: insertedResumeValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_resumes:', error);
//         throw error;
//     }
// }




// async function seedCoverLetters(client) {
//     try {
//         await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//         const createTable = await client.sql`
//         CREATE TABLE IF NOT EXISTS t_cover_letter(
//             id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//             url VARCHAR(255) NOT NULL,
//             applicant_id UUID NOT NULL
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (applicant_id) REFERENCES t_candidate_information(id)
//         );
//         `;

//         console.log(`Created "t_cover_letter" table`);

//         const insertedCoverLetterValues = await Promise.all(
//             cover_letter_values.map(
//                 (coverLetterValue) => client.sql`
//                 INSERT INTO t_cover_letter (name,url, applicant_id)
//                 VALUES (${coverLetterValue.name}, ${coverLetterValue.url}, ${coverLetterValue.applicant_id})
//                 ON CONFLICT (id) DO NOTHING;
//                 `,
//             ),
//         );
//         console.log(`Seeded ${insertedCoverLetterValues.length} t_cover_letter`);
//         return {
//             createTable,
//             t_cover_letter: insertedCoverLetterValues
//         };
//     } catch (error) {
//         console.error('Error seeding t_cover_letter:', error);
//         throw error;
//     }
// }






















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