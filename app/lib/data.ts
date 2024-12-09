//import { sql } from '@vercel/postgres';
import { Pool } from 'pg'; // Import Pool from pg
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import {
  JobCount,
  JobsTable,
  User,
  Requirement,
  Station,
  JobForm,
  RequirementType,
  JobGroup,
  Responsibility,
  Gender,
  Country,
  Languages,
  ApplicationOrigin,
  EducationLevel,
  DegreeName,
  SubjectName,
  ApplicantForm

} from './definitions';

// Set up your PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Use your database URL here
});

// export async function fetchJobCount() {
//   noStore
//   // Add noStore() here to prevent th e response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).

//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)
//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await pool.query<JobCount>`
//         SELECT 
//         DATE_TRUNC('month', date) AS month,
//         COUNT(*) AS job_count
//     FROM 
//         jobs
//     WHERE 
//         date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '11 months'
//     GROUP BY 
//         DATE_TRUNC('month', date)
//     HAVING 
//         COUNT(*) > 0
//     ORDER BY 
//         month`;

//     // console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch jobcount data.');
//   }
// }

export async function fetchJobCount() {
  noStore(); // Call noStore() to prevent caching.

  try {
    // Query to fetch job count using a regular SQL string
    const query = `
        SELECT 
            DATE_TRUNC('month', date) AS month,
            COUNT(*) AS job_count
        FROM 
            jobs
        WHERE 
            date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY 
            DATE_TRUNC('month', date)
        HAVING 
            COUNT(*) > 0
        ORDER BY 
            month
    `;

    const { rows } = await pool.query<JobCount>(query); // Use the query string directly

    return rows; // Return the rows directly
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch job count data.');
  }
}


const LATEST_JOBS = 5;
// export async function getLatestJobs() {
//   noStore
//   try {
//     const data = await sql<JobsTable>`
//       SELECT
//         jb.id,
//         jb.position,
//         sta.station,
//         jbg.job_group,
//         jb.date AS datecreated,
//         jb.period,
//         jb.status,
//         tms.term
//       FROM
//         jobs AS jb
//       LEFT JOIN
//         stations as sta on jb.station_id=sta.id
//       LEFT JOIN 
//         job_groups as jbg on jb.group_id=jbg.id
//       LEFT JOIN
//         terms as tms on jb.term_id=tms.id
//       ORDER BY jb.date DESC
//       LIMIT ${LATEST_JOBS}
//     `;

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch all jobs.');
//   }
// }


export async function getLatestJobs() {
  noStore(); // Call noStore() to prevent caching


  try {
    const query = `
      SELECT
        jb.id,
        jb.position,
        sta.station,
        jbg.job_group,
        jb.date AS datecreated,
        jb.status
      FROM
        jobs AS jb
      LEFT JOIN
        stations as sta on jb.station_id = sta.id
      LEFT JOIN 
        job_groups as jbg on jb.group_id = jbg.id
      ORDER BY 
        jb.date DESC
      LIMIT $1;
    `;

    const { rows } = await pool.query<JobsTable>(query, [LATEST_JOBS]); // Fetch the latest 5 jobs

    return rows; // Return the results
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest jobs.');
  }
}

// export async function fetchCardData() {
//   noStore
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const jobCountPromise = sql`SELECT COUNT(*) FROM jobs`;
//     const jobStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS "pending",
//          SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS "closed"
//          FROM jobs`;

//     const data = await Promise.all([
//       jobCountPromise,
//       jobStatusPromise,
//     ]);

//     const numberOfJobs = Number(data[0].rows[0].count ?? '0');
//     const totalPendingJobs = Number(data[1].rows[0].pending ?? '0');
//     const totalClosedJobs = Number(data[1].rows[0].closed ?? '0');

//     return {
//       numberOfJobs,
//       totalPendingJobs,
//       totalClosedJobs,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

export async function fetchCardData() {
  noStore(); // Call noStore to prevent caching

  try {
    // Create the queries as promises
    const jobCountPromise = pool.query(`SELECT COUNT(*) FROM jobs`);
    const jobStatusPromise = pool.query(`
      SELECT
         SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS open,
         SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed
      FROM jobs
    `);

    // Run both queries in parallel using Promise.all
    const [jobCountResult, jobStatusResult] = await Promise.all([
      jobCountPromise,
      jobStatusPromise,
    ]);

    // Extract the counts from the results
    const numberOfJobs = Number(jobCountResult.rows[0].count ?? '0');
    const totalPendingJobs = Number(jobStatusResult.rows[0].open ?? '0');
    const totalClosedJobs = Number(jobStatusResult.rows[0].closed ?? '0');

    // Return the results
    return {
      numberOfJobs,
      totalPendingJobs,
      totalClosedJobs,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}



const ITEMS_PER_PAGE = 6;

// export async function fetchFilteredJobs(query: string, currentPage: number) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//   try {
//     const jobs = await sql<JobsTable>`
//       SELECT
//         jb.id,
//         jb.position,
//         sta.station,
//         jbg.job_group,
//         jb.period,
//         jb.date AS datecreated,
//         COALESCE(req_data.requirement, ARRAY[]::text[]) AS requirement,
//         COALESCE(resp_data.responsibility, ARRAY[]::text[]) AS responsibility,
//         jb.status
//       FROM
//         jobs AS jb
//       LEFT JOIN
//         stations AS sta ON jb.station_id = sta.id
//       LEFT JOIN
//         job_groups AS jbg ON jb.group_id = jbg.id
//       LEFT JOIN (
//         SELECT
//           req.position_id,
//           array_agg(req.requirement) AS requirement
//         FROM
//           requirements AS req
//         GROUP BY
//           req.position_id
//       ) AS req_data ON jb.id = req_data.position_id
//       LEFT JOIN (
//         SELECT
//           resp.position_id,
//           array_agg(resp.responsibility) AS responsibility
//         FROM
//           responsibilities AS resp
//         GROUP BY
//           resp.position_id
//       ) AS resp_data ON jb.id = resp_data.position_id
//       WHERE 
//         jb.position ILIKE ${`%${query}%`} OR
//         sta.station ILIKE ${`%${query}%`} OR
//         jb.date::text ILIKE ${`%${query}%`} OR
//         jb.status ILIKE ${`%${query}%`} OR
//         array_to_string(req_data.requirement, ', ') ILIKE ${`%${query}%`} OR
//         array_to_string(resp_data.responsibility, ', ') ILIKE ${`%${query}%`}
//       ORDER BY jb.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;
//     return jobs.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch jobs.');
//   }
// }

export async function fetchFilteredJobs(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const jobsQuery = `
      SELECT
        jb.id,
        jb.position,
        sta.station,
        jbg.job_group,
        jb.date AS datecreated,
        COALESCE(req_data.requirement, ARRAY[]::TEXT[]) AS requirement,
        COALESCE(resp_data.responsibility, ARRAY[]::TEXT[]) AS responsibility,
        jb.status
      FROM
        jobs AS jb
      LEFT JOIN
        stations AS sta ON jb.station_id = sta.id
      LEFT JOIN
        job_groups AS jbg ON jb.group_id = jbg.id
      LEFT JOIN (
        SELECT
          req.position_id,
          array_agg(req.requirement) AS requirement
        FROM
          requirements AS req
        GROUP BY
          req.position_id
      ) AS req_data ON jb.id = req_data.position_id
      LEFT JOIN (
        SELECT
          resp.position_id,
          array_agg(resp.responsibility) AS responsibility
        FROM
          responsibilities AS resp
        GROUP BY
          resp.position_id
      ) AS resp_data ON jb.id = resp_data.position_id
      WHERE 
        jb.position ILIKE $1 OR
        sta.station ILIKE $1 OR
        jb.date::TEXT ILIKE $1 OR
        jb.status ILIKE $1 OR
        array_to_string(req_data.requirement, ', ') ILIKE $1 OR
        array_to_string(resp_data.responsibility, ', ') ILIKE $1
      ORDER BY jb.date DESC
      LIMIT $2 OFFSET $3
    `;

    // Prepare the parameters for the query
    const queryParam = `%${query}%`;
    const values = [queryParam, ITEMS_PER_PAGE, offset];

    // Execute the query
    const { rows } = await pool.query<JobsTable>(jobsQuery, values);

    // Return the rows fetched by the query
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch jobs.');
  }
}

// export async function fetchJobsPages(query: string) {
//   noStore
//   try {
//     const count = await sql`
//       SELECT 
//         COUNT(*)
//       FROM
//         jobs AS jb
//       LEFT JOIN
//         stations as sta on jb.station_id=sta.id
//       LEFT JOIN
//         requirements AS rq ON jb.id = rq.position_id
//       WHERE 
//         jb.position ILIKE ${`%${query}%`} OR
//         sta.station ILIKE ${`%${query}%`} OR
//         jb.date ::text ILIKE ${`%${query}%`} OR
//         rq.requirement ILIKE ${`%${query}%`} OR
//         jb.status ILIKE ${`%${query}%`}
//     `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of jobs.');
//   }
// }
export async function fetchJobsPages(query: string) {
  try {
    const jobsCountQuery = `
      SELECT 
        COUNT(*) AS count
      FROM
        jobs AS jb
      LEFT JOIN
        stations AS sta ON jb.station_id = sta.id
      LEFT JOIN
        requirements AS rq ON jb.id = rq.position_id
      WHERE 
        jb.position ILIKE $1 OR
        sta.station ILIKE $1 OR
        jb.date::TEXT ILIKE $1 OR
        rq.requirement ILIKE $1 OR
        jb.status ILIKE $1
    `;

    // Prepare the parameter for the query
    const queryParam = `%${query}%`;

    // Execute the query
    const { rows } = await pool.query(jobsCountQuery, [queryParam]);

    // Calculate total pages
    const totalPages = Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
    
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of jobs.');
  }
}

// export async function fetchRequirementTypes() {
//   noStore
//   try {
//     const data = await sql<RequirementType>`
//       SELECT
//         id,
//         requirement_type
//       FROM requirement_types
//       ORDER BY requirement_type ASC
//     `;

//     const requirementtypes = data.rows;
//     return requirementtypes;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all requirementtypes.');
//   }
// }

// export async function fetchRequirements() {
//   noStore
//   try {
//     const data = await sql<Requirement>`
//       SELECT
//         id,
//         position_id,
//         requirement,
//         rqtype_id
//       FROM requirements
//       ORDER BY requirement ASC
//     `;

//     const requirements = data.rows;
//     return requirements;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all requirements.');
//   }
// }

export async function fetchRequirements() {
  try {
    const requirementsQuery = `
      SELECT
        id,
        position_id,
        requirement
      FROM requirements
      ORDER BY requirement ASC
    `;

    // Execute the query
    const { rows } = await pool.query(requirementsQuery);

    return rows; // Return the rows directly
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all requirements.');
  }
}

// export async function fetchJobGroups() {
//   noStore
//   try {
//     const data = await sql<JobGroup>`
//       SELECT
//         id,
//         job_group
//       FROM job_groups
//       ORDER BY job_group ASC
//     `;

//     const jobGroups = data.rows;
//     return jobGroups;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all jobGroups.');
//   }
// }

export async function fetchJobGroups() {
  try {
    const jobGroupsQuery = `
      SELECT
        id,
        job_group
      FROM job_groups
      ORDER BY job_group ASC
    `;

    // Execute the query
    const { rows } = await pool.query(jobGroupsQuery);

    return rows; // Return the rows directly
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all job groups.');
  }
}


// export async function fetchLocations() {
//   noStore
//   try {
//     const data = await sql<Station>`
//       SELECT
//         id,
//         station
//       FROM stations
//       ORDER BY station ASC
//     `;

//     const requirements = data.rows;
//     return requirements;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all locations.');
//   }
// }

export async function fetchLocations() {
  try {
    const locationsQuery = `
      SELECT
        id,
        station
      FROM stations
      ORDER BY station ASC
    `;

    // Execute the query
    const { rows } = await pool.query(locationsQuery);

    return rows; // Return the rows directly
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all locations.');
  }
}

// export async function getUser(email: string) {
//   noStore
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }


// export async function fetchJobById(id: string) {
//   noStore
//   try {



//     const data = await sql<JobForm>`
//     WITH req_data AS (
//         SELECT
//           req.position_id,
//           json_agg(json_build_object(
//             'id', req.id,
//             'requirement', req.requirement,
//             'position_id', req.position_id,
//             'group_id', req.group_id,
//             'rqtype_id', req.rqtype_id
//           )) AS requirements
//         FROM requirements req
//         GROUP BY req.position_id
//       ),
//       resp_data AS (
//         SELECT
//           resp.position_id,
//           json_agg(json_build_object(
//             'id', resp.id,
//             'responsibility', resp.responsibility,
//             'position_id', resp.position_id,
//             'group_id', resp.group_id
//           )) AS responsibilities
//         FROM responsibilities resp
//         GROUP BY resp.position_id
//       ),
//       job_details AS (
//         SELECT
//           jobs.id,
//           jobs.position,
//           jobs.station_id,
//           jobs.group_id AS job_group,
//           jobs.period,
//           jobs.startDate AS startDate,
//           jobs.endDate AS endDate,
//           jobs.status
//         FROM jobs
//         WHERE jobs.id = ${id}
//       )
//       SELECT
//         job_details.id,
//         job_details.position,
//         job_details.station_id,
//         job_details.job_group,
//         job_details.period,
//         job_details.startDate,
//         job_details.endDate,
//         job_details.status,
      
//         COALESCE(req_data.requirements, '[]') AS requirement,
//         COALESCE(resp_data.responsibilities, '[]') AS responsibility
//       FROM job_details
//       LEFT JOIN req_data ON job_details.id = req_data.position_id
//       LEFT JOIN resp_data ON job_details.id = resp_data.position_id;
//       `;

//     const job = data.rows
//     return job[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch job.');
//   }
// }

export async function fetchJobById(id: string) {
  try {
    const query = `
      WITH req_data AS (
        SELECT
          req.position_id,
          json_agg(json_build_object(
            'id', req.id,
            'requirement', req.requirement,
            'position_id', req.position_id,
            'group_id', req.group_id
          )) AS requirements
        FROM requirements req
        GROUP BY req.position_id
      ),
      resp_data AS (
        SELECT
          resp.position_id,
          json_agg(json_build_object(
            'id', resp.id,
            'responsibility', resp.responsibility,
            'position_id', resp.position_id,
            'group_id', resp.group_id
          )) AS responsibilities
        FROM responsibilities resp
        GROUP BY resp.position_id
      ),
      job_details AS (
        SELECT
          jobs.id,
          jobs.position,
          jobs.station_id,
          jobs.group_id AS job_group,
          
          jobs.startDate AS startDate,
          jobs.endDate AS endDate,
          jobs.status
        FROM jobs
        WHERE jobs.id = $1
      )
      SELECT
        job_details.id,
        job_details.position,
        job_details.station_id,
        job_details.job_group,
        
        job_details.startDate,
        job_details.endDate,
        job_details.status,
        COALESCE(req_data.requirements, '[]') AS requirement,
        COALESCE(resp_data.responsibilities, '[]') AS responsibility
      FROM job_details
      LEFT JOIN req_data ON job_details.id = req_data.position_id
      LEFT JOIN resp_data ON job_details.id = resp_data.position_id;
    `;

    const { rows } = await pool.query(query, [id]); // Use pool.query with parameterized ID

    return rows[0]; // Return the first job from the results
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch job.');
  }
}


// export async function fetchRequirementsByJobGroup(id: string) {
//   noStore
//   try {
//     let data;
//     if (id) {
//       data = await sql<Requirement>`
//         SELECT
//           requirements.id,
//           requirements.requirement,
//           requirements.position_id,
//           requirements.group_id,
//           requirements.rqtype_id
//         FROM requirements
//         WHERE requirements.group_id = ${id};
//       `;
//     } else {
//       data = await sql<Requirement>`
//         SELECT
//           requirements.id,
//           requirements.requirement,
//           requirements.position_id,
//           requirements.group_id,
//           requirements.rqtype_id
//         FROM requirements;
//       `;
//     }

//     const requirements = data.rows;
//     revalidatePath('/dashboard/jobs/create');
//     return requirements;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all requirements.');
//   }

// }

export async function fetchRequirementsByJobGroup(id: string) {
  try {
    let query;
    const params = [];

    if (id) {
      query = `
        SELECT
          requirements.id,
          requirements.requirement,
          requirements.position_id,
          requirements.group_id
        FROM requirements
        WHERE requirements.group_id = $1;
      `;
      params.push(id); // Add the job group ID to the parameters array
    } else {
      query = `
        SELECT
          requirements.id,
          requirements.requirement,
          requirements.position_id,
          requirements.group_id
        FROM requirements;
      `;
    }

    const { rows } = await pool.query(query, params); // Use pool.query with parameters

    revalidatePath('/dashboard/jobs/create'); // Assuming this is part of your application logic
    return rows; // Return the fetched requirements
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all requirements.');
  }
}


// export async function fetchResponsibilityByJobGroup(id: string) {
//   noStore
//   try {
//     let data;
//     if (id) {
//       data = await sql<Responsibility>`
//         SELECT
//           responsibilities.id,
//           responsibilities.responsibility,
//           responsibilities.position_id,
//           responsibilities.group_id
//         FROM responsibilities
//         WHERE responsibilities.group_id = ${id};
//       `;
//     } else {
//       data = await sql<Responsibility>`
//         SELECT
//           responsibilities.id,
//           responsibilities.responsibility,
//           responsibilities.position_id,
//           responsibilities.group_id
//         FROM responsibilities;
//       `;
//     }

//     const responsibilities = data.rows;
//     revalidatePath('/dashboard/jobs/create');
//     return responsibilities;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all responsibilities.');
//   }

// }

export async function fetchResponsibilityByJobGroup(id: string) {
  try {
    let query;
    const params = [];

    if (id) {
      query = `
        SELECT
          responsibilities.id,
          responsibilities.responsibility,
          responsibilities.position_id,
          responsibilities.group_id
        FROM responsibilities
        WHERE responsibilities.group_id = $1;
      `;
      params.push(id); // Add the job group ID to the parameters array
    } else {
      query = `
        SELECT
          responsibilities.id,
          responsibilities.responsibility,
          responsibilities.position_id,
          responsibilities.group_id
        FROM responsibilities;
      `;
    }

    const { rows } = await pool.query(query, params); // Use pool.query with parameters

    revalidatePath('/dashboard/jobs/create'); // Assuming this is part of your application logic
    return rows; // Return the fetched responsibilities
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all responsibilities.');
  }
}

// export async function fetchRequirementsByJobGroupEdit(id: string, job_id:string) {
//   noStore
//   try {
//     let data;
//     if (id) {
//       data = await sql<Requirement>`
//         SELECT
//           requirements.id,
//           requirements.requirement,
//           requirements.position_id,
//           requirements.group_id,
//           requirements.rqtype_id
//         FROM requirements
//         WHERE requirements.group_id = ${id};
//       `;
//     } else {
//       data = await sql<Requirement>`
//         SELECT
//           requirements.id,
//           requirements.requirement,
//           requirements.position_id,
//           requirements.group_id,
//           requirements.rqtype_id
//         FROM requirements;
//       `;
//     }

//     const requirements = data.rows;
//     revalidatePath(`/dashboard/jobs/${job_id}/edit`);
//     return requirements;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all requirements.');
//   }

// }

export async function fetchRequirementsByJobGroupEdit(id: string, job_id: string) {
  try {
    let query;
    const params = [];

    if (id) {
      query = `
        SELECT
          requirements.id,
          requirements.requirement,
          requirements.position_id,
          requirements.group_id
        FROM requirements
        WHERE requirements.group_id = $1;
      `;
      params.push(id); // Add the group ID to the parameters array
    } else {
      query = `
        SELECT
          requirements.id,
          requirements.requirement,
          requirements.position_id,
          requirements.group_id
        FROM requirements;
      `;
    }

    const { rows } = await pool.query(query, params); // Use pool.query with parameters

    revalidatePath(`/dashboard/jobs/${job_id}/edit`); // Assuming this is part of your application logic
    return rows; // Return the fetched requirements
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all requirements.');
  }
}


// export async function fetchResponsibilityByJobGroupEdit(id: string, job_id:string) {
//   noStore
//   try {
//     let data;
//     if (id) {
//       data = await sql<Responsibility>`
//         SELECT
//           responsibilities.id,
//           responsibilities.responsibility,
//           responsibilities.position_id,
//           responsibilities.group_id
//         FROM responsibilities
//         WHERE responsibilities.group_id = ${id};
//       `;
//     } else {
//       data = await sql<Responsibility>`
//         SELECT
//           responsibilities.id,
//           responsibilities.responsibility,
//           responsibilities.position_id,
//           responsibilities.group_id
//         FROM responsibilities;
//       `;
//     }

//     const responsibilities = data.rows;
//     revalidatePath(`/dashboard/jobs/${job_id}/edit`);
//     return responsibilities;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all responsibilities.');
//   }

// }


export async function fetchResponsibilityByJobGroupEdit(id: string, job_id: string) {
  try {
    let query;
    const params = [];

    if (id) {
      query = `
        SELECT
          responsibilities.id,
          responsibilities.responsibility,
          responsibilities.position_id,
          responsibilities.group_id
        FROM responsibilities
        WHERE responsibilities.group_id = $1;
      `;
      params.push(id); // Add the group ID to the parameters array
    } else {
      query = `
        SELECT
          responsibilities.id,
          responsibilities.responsibility,
          responsibilities.position_id,
          responsibilities.group_id
        FROM responsibilities;
      `;
    }

    const { rows } = await pool.query(query, params); // Use pool.query with parameters

    revalidatePath(`/dashboard/jobs/${job_id}/edit`); // Assuming this is part of your application logic
    return rows; // Return the fetched responsibilities
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all responsibilities.');
  }
}

//Applicant Data Details

// export async function fetchGender() {
//   noStore
//   try {
//     const data = await sql<Gender>`
//       SELECT
//         id,
//         name
//       FROM t_gender
//     `;

//     const gender = data.rows;
//     return gender;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch gender table.');
//   }
// }

// Function to fetch gender data from the database
export async function fetchGender() {
  try {
    // SQL query to fetch gender information
    const query = `
      SELECT
        id,
        name
      FROM t_gender;
    `;

    // Execute the query using the pool to manage the database connection
    const { rows } = await pool.query(query); 

    return rows; // Return the fetched gender rows
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch gender data.');
  }
}


// export async function fetchCountries() {
//   noStore
//   try {
//     const data = await sql<Country>`
//       SELECT
//         id,
//         name,
//         country_code,
//         continent,
//         region
//       FROM t_country
//     `;

//     const countries = data.rows;
//     return countries;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch country table.');
//   }
// }


// Function to fetch country data from the database
export async function fetchCountries() {
  try {
    // SQL query to fetch country information
    const query = `
      SELECT
        id,
        name,
        country_code,
        continent,
        region
      FROM t_country;
    `;

    // Execute the query using the pool to manage the database connection
    const { rows } = await pool.query(query);

    return rows; // Return the fetched country rows
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch country data.');
  }
}


// export async function fetchLanguages() {
//   noStore
//   try {
//     const data = await sql<Languages>`
//       SELECT
//         id,
//         name,
//         language_code,
//         native_name
//       FROM t_language
//     `;

//     const languages = data.rows;
//     return languages;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch language table.');
//   }
// }

// Function to fetch language data from the database
export async function fetchLanguages() {
  try {
    // SQL query to fetch language information
    const query = `
      SELECT
        id,
        name,
        language_code,
        native_name
      FROM t_language;
    `;

    // Execute the query using the pool to manage the database connection
    const { rows } = await pool.query(query);

    return rows; // Return the fetched language rows
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch language data.');
  }
}



// export async function fetchApplicationOrigin() {
//   noStore
//   try {
//     const data = await sql<ApplicationOrigin>`
//       SELECT
//         id,
//         source,
//         description
//       FROM t_application_origin
//     `;

//     const applicationOrigin = data.rows;
//     return applicationOrigin;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch t_application_origin table.');
//   }
// }

// Function to fetch application origin data from the database
export async function fetchApplicationOrigin() {
  try {
    // SQL query to fetch application origin information
    const query = `
      SELECT
        id,
        source,
        description
      FROM t_application_origin;
    `;

    // Execute the query using the pool to manage the database connection
    const { rows } = await pool.query(query);

    return rows; // Return the fetched application origin rows
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch application origin data.');
  }
}



// export async function fetchEducationLevel() {
//   noStore
//   try {
//     const data = await sql<EducationLevel>`
//       SELECT
//         id,
//         level,
//         abbreviation,
//         description
//       FROM t_education_level
//     `;

//     const educationLevel = data.rows;
//     return educationLevel;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch t_education_level table.');
//   }
// }

// Function to fetch education level data from the database
export async function fetchEducationLevel() {
  try {
    // SQL query to fetch education level information
    const query = `
      SELECT
        id,
        level,
        abbreviation,
        description
      FROM t_education_level;
    `;

    // Execute the query using the pool to manage the database connection
    const { rows } = await pool.query(query);

    return rows; // Return the fetched education level rows
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch education level data.');
  }
}


// export async function fetchDegreeName() {
//   noStore
//   try {
//     const data = await sql<DegreeName>`
//       SELECT
//         id,
//         name
//       FROM t_degree_name
//     `;

//     const degreeName = data.rows;
//     return degreeName;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch t_degree_name.');
//   }
// }

// Function to fetch degree name data from the database
export async function fetchDegreeName() {
  try {
    // SQL query to fetch degree name information
    const query = `
      SELECT
        id,
        name
      FROM t_degree_name;
    `;

    // Execute the query using the pool to manage the database connection
    const { rows } = await pool.query(query);

    return rows; // Return the fetched degree name rows
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch degree name data.');
  }
}



// export async function fetchSubjectName() {
//   noStore
//   try {
//     const data = await sql<SubjectName>`
//       SELECT
//         id,
//         name
//       FROM t_subject
//     `;

//     const subjectName = data.rows;
//     return subjectName;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch t_subject.');
//   }
// }


export type ViewJob = {
  id: string;
  position: string;
  station: string;
  job_group: string;
  requirement: Requirement[];
  responsibility: Responsibility[];
  startdate: string;
  enddate: string;
  status: 'Open' | 'Closed';
  date_created: string;
};



// export async function fetchJob(id: string) {
//   noStore
//   try {



//     const data = await sql<ViewJob>`
//     WITH req_data AS (
//         SELECT
//           req.position_id,
//           json_agg(json_build_object(
//             'id', req.id,
//             'requirement', req.requirement,
//             'position_id', req.position_id,
//             'group_id', req.group_id,
//             'rqtype_id', req.rqtype_id
//           )) AS requirements
//         FROM requirements req
//         GROUP BY req.position_id
//       ),
//       resp_data AS (
//         SELECT
//           resp.position_id,
//           json_agg(json_build_object(
//             'id', resp.id,
//             'responsibility', resp.responsibility,
//             'position_id', resp.position_id,
//             'group_id', resp.group_id
//           )) AS responsibilities
//         FROM responsibilities resp
//         GROUP BY resp.position_id
//       ),
//       job_details AS (
//         SELECT
//           jobs.id,
//           jobs.position,
//           jobs.station_id,
//           jobs.group_id AS job_group,
//           jobs.period,
//           jobs.startDate AS startDate,
//           jobs.endDate AS endDate,
//           jobs.status
//         FROM jobs
//         WHERE jobs.id = ${id}
//       )
//       SELECT
//         job_details.id,
//         job_details.position,
//         job_details.station_id,
//         job_details.job_group,
//         job_details.period,
//         job_details.startDate,
//         job_details.endDate,
//         job_details.status,
      
//         COALESCE(req_data.requirements, '[]') AS requirement,
//         COALESCE(resp_data.responsibilities, '[]') AS responsibility
//       FROM job_details
//       LEFT JOIN req_data ON job_details.id = req_data.position_id
//       LEFT JOIN resp_data ON job_details.id = resp_data.position_id;
//       `;

//     const job = data.rows
//     return job[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch job.');
//   }
// }

// Function to fetch job details along with requirements and responsibilities
export async function fetchJob(id: string) {
  try {
    // SQL query to fetch job details, requirements, and responsibilities
    const query = `
      WITH req_data AS (
        SELECT
          req.position_id,
          json_agg(json_build_object(
            'id', req.id,
            'requirement', req.requirement,
            'position_id', req.position_id,
            'group_id', req.group_id,
            'rqtype_id', req.rqtype_id
          )) AS requirements
        FROM requirements req
        GROUP BY req.position_id
      ),
      resp_data AS (
        SELECT
          resp.position_id,
          json_agg(json_build_object(
            'id', resp.id,
            'responsibility', resp.responsibility,
            'position_id', resp.position_id,
            'group_id', resp.group_id
          )) AS responsibilities
        FROM responsibilities resp
        GROUP BY resp.position_id
      ),
      job_details AS (
        SELECT
          jobs.id,
          jobs.position,
          jobs.station_id,
          jobs.group_id AS job_group,
          jobs.period,
          jobs.startDate AS startDate,
          jobs.endDate AS endDate,
          jobs.status
        FROM jobs
        WHERE jobs.id = $1
      )
      SELECT
        job_details.id,
        job_details.position,
        job_details.station_id,
        job_details.job_group,
        job_details.period,
        job_details.startDate,
        job_details.endDate,
        job_details.status,
        COALESCE(req_data.requirements, '[]') AS requirement,
        COALESCE(resp_data.responsibilities, '[]') AS responsibility
      FROM job_details
      LEFT JOIN req_data ON job_details.id = req_data.position_id
      LEFT JOIN resp_data ON job_details.id = resp_data.position_id;
    `;

    // Execute the query using the pool, passing the job ID as a parameter
    const { rows } = await pool.query(query, [id]);

    return rows[0]; // Return the first result (the job details)
  } catch (error) {
    // Handle any database errors
    console.error('Database Error:', error);
    throw new Error('Failed to fetch job details.');
  }
}



// export async function fetchApplicantData() {
//   noStore
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const jobCountPromise = sql`SELECT COUNT(*) FROM t_candidate_information`;
//     const jobStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS "pending",
//          SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS "closed"
//          FROM jobs`;

//     const data = await Promise.all([
//       jobCountPromise,
//       jobStatusPromise,
//     ]);

//     const numberOfJobs = Number(data[0].rows[0].count ?? '0');
//     const totalPendingJobs = Number(data[1].rows[0].pending ?? '0');
//     const totalClosedJobs = Number(data[1].rows[0].closed ?? '0');

//     return {
//       numberOfJobs,
//       totalPendingJobs,
//       totalClosedJobs,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

// Function to fetch applicant data (job count and job status)
export async function fetchApplicantData() {
  try {
    // Two separate queries: one for counting candidates and another for job statuses
    const jobCountPromise = pool.query(`
      SELECT COUNT(*) FROM t_candidate_information;
    `);

    const jobStatusPromise = pool.query(`
      SELECT
        SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS "pending",
        SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS "closed"
      FROM jobs;
    `);

    // Run both queries in parallel and wait for results
    const data = await Promise.all([jobCountPromise, jobStatusPromise]);

    // Extract the counts from the results
    const numberOfJobs = Number(data[0].rows[0].count ?? '0');
    const totalPendingJobs = Number(data[1].rows[0].pending ?? '0');
    const totalClosedJobs = Number(data[1].rows[0].closed ?? '0');

    // Return the aggregated data
    return {
      numberOfJobs,
      totalPendingJobs,
      totalClosedJobs,
    };
  } catch (error) {
    // Handle any errors during the database queries
    console.error('Database Error:', error);
    throw new Error('Failed to fetch applicant data.');
  }
}


// export async function fetchApplicantInformation() {
//   noStore
//   try {



//     const data = await sql<ApplicantForm>`
//     WITH applicant_education_data AS (
//         SELECT
//           tae.applicant_id,
//           json_agg(json_build_object(
//             'id', tae.id,
//             'applicant_id', tae.applicant_id,
//             'education_level_id', tae.education_level_id,
//             'degree_name_id', tae.degree_name_id,
//             'start_date', tae.start_date,
//             'end_date', tae.end_date,
//             'institution_name', tae.institution_name,
//             'created_at', tae.created_at,
//             'updated_at', tae.updated_at,
//             'is_highest_level', tae.is_highest_level
//           )) AS applicant_educations
//         FROM t_applicant_education AS tae
//         GROUP BY tae.applicant_id
//       ),
//       t_experience_data AS (
//         SELECT
//           te.applicant_id,
//           json_agg(json_build_object(
//             'id', te.id,
//             'applicant_id', te.applicant_id,
//             'job_title', te.job_title,
//             'company_name', te.company_name,
//             'start_date', te.start_date,
//             'end_date', te.end_date,
//             'description', te.description,
//             'created_at', te.created_at,
//             'updated_at', te.updated_at,
//             'current_workplace', te.current_workplace
//           )) AS applicant_experiences
//         FROM t_experience AS te
//         GROUP BY te.applicant_id
//       ),
//       t_resumes_data AS (
//         SELECT
//           tr.applicant_id,
//           json_agg(json_build_object(
//             'id', tr.id,
//             'name', tr.name,
//             'url', tr.url,
//             'applicant_id', tr.applicant_id,
//             'created_at', tr.created_at,
//             'updated_at', tr.updated_at
//           )) AS applicant_resumes
//         FROM t_resumes AS tr
//         GROUP BY tr.applicant_id
//       ),
//       t_cover_letter_data AS (
//         SELECT
//           tcl.applicant_id,
//           json_agg(json_build_object(
//             'id', tcl.id,
//             'name', tcl.name,
//             'url', tcl.url,
//             'applicant_id', tcl.applicant_id,
//             'created_at', tcl.created_at,
//             'updated_at', tcl.updated_at
//           )) AS applicant_cover_letters
//         FROM t_cover_letter AS tcl
//         GROUP BY tcl.applicant_id
//       ),
//       t_applicant_information_data AS (
//         SELECT
//           tci.id,
//           tci.genderid,
//           tci.fullname,
//           tci.firstname,
//           tci.permanentaddress,
//           tci.postalcode,
//           tci.city,
//           tci.countryofresidence,
//           tci.phone,
//           tci.email,
//           tci.languageid1,
//           tci.languageid2,
//           tci.applicationoriginid,
//           tci.created_at,
//           tci.updated_at,
//           tci.positionid
//         FROM t_candidate_information AS tci
//       )
//       SELECT
//         t_applicant_information_data.id,
//         t_applicant_information_data.genderid,
//         t_applicant_information_data.fullname,
//         t_applicant_information_data.firstname,
//         t_applicant_information_data.permanentaddress,
//         t_applicant_information_data.postalcode,
//         t_applicant_information_data.city,
//         t_applicant_information_data.countryofresidence,
//         t_applicant_information_data.phone,
//         t_applicant_information_data.email,
//         t_applicant_information_data.languageid1,
//         t_applicant_information_data.languageid2,
//         t_applicant_information_data.applicationoriginid,
//         t_applicant_information_data.created_at,
//         t_applicant_information_data.updated_at,
//         t_applicant_information_data.positionid,
//         COALESCE(applicant_education_data.applicant_educations, '[]') AS app_educations,
//         COALESCE(t_experience_data.applicant_experiences, '[]') AS app_experiences,
//         COALESCE(t_resumes_data.applicant_resumes, '[]') AS app_resumes,
//         COALESCE(t_cover_letter_data.applicant_cover_letters, '[]') AS app_cover_letters,
//         jobs.position AS position_applied,
//         t_gender.name AS gender,
//         t_country.name AS country
//       FROM t_applicant_information_data
//       LEFT JOIN applicant_education_data ON t_applicant_information_data.id = applicant_education_data.applicant_id
//       LEFT JOIN t_experience_data ON t_applicant_information_data.id = t_experience_data.applicant_id
//       LEFT JOIN t_resumes_data ON t_applicant_information_data.id = t_resumes_data.applicant_id
//       LEFT JOIN t_cover_letter_data ON t_applicant_information_data.id = t_cover_letter_data.applicant_id
//       LEFT JOIN jobs ON t_applicant_information_data.positionid = jobs.id
//       LEFT JOIN t_gender ON t_applicant_information_data.genderid = t_gender.id
//       LEFT JOIN t_country ON t_applicant_information_data.countryofresidence = t_country.id;
//             `;

     
//     return data.rows;
    
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch applicant information.');
//   }
// }


export async function fetchApplicantInformation() {
  try {
    // SQL query to fetch applicant information along with related data
    const query = `
      WITH applicant_education_data AS (
        SELECT
          tae.applicant_id,
          json_agg(json_build_object(
            'id', tae.id,
            'applicant_id', tae.applicant_id,
            'education_level_id', tae.education_level_id,
            'degree_name_id', tae.degree_name_id,
            'start_date', tae.start_date,
            'end_date', tae.end_date,
            'institution_name', tae.institution_name,
            'created_at', tae.created_at,
            'updated_at', tae.updated_at,
            'is_highest_level', tae.is_highest_level
          )) AS applicant_educations
        FROM t_applicant_education AS tae
        GROUP BY tae.applicant_id
      ),
      t_experience_data AS (
        SELECT
          te.applicant_id,
          json_agg(json_build_object(
            'id', te.id,
            'applicant_id', te.applicant_id,
            'job_title', te.job_title,
            'company_name', te.company_name,
            'start_date', te.start_date,
            'end_date', te.end_date,
            'description', te.description,
            'created_at', te.created_at,
            'updated_at', te.updated_at,
            'current_workplace', te.current_workplace
          )) AS applicant_experiences
        FROM t_experience AS te
        GROUP BY te.applicant_id
      ),
      t_resumes_data AS (
        SELECT
          tr.applicant_id,
          json_agg(json_build_object(
            'id', tr.id,
            'name', tr.name,
            'url', tr.url,
            'applicant_id', tr.applicant_id,
            'created_at', tr.created_at,
            'updated_at', tr.updated_at
          )) AS applicant_resumes
        FROM t_resumes AS tr
        GROUP BY tr.applicant_id
      ),
      t_cover_letter_data AS (
        SELECT
          tcl.applicant_id,
          json_agg(json_build_object(
            'id', tcl.id,
            'name', tcl.name,
            'url', tcl.url,
            'applicant_id', tcl.applicant_id,
            'created_at', tcl.created_at,
            'updated_at', tcl.updated_at
          )) AS applicant_cover_letters
        FROM t_cover_letter AS tcl
        GROUP BY tcl.applicant_id
      ),
      t_applicant_information_data AS (
        SELECT
          tci.id,
          tci.genderid,
          tci.fullname,
          tci.firstname,
          tci.permanentaddress,
          tci.postalcode,
          tci.city,
          tci.countryofresidence,
          tci.phone,
          tci.email,
          tci.languageid,
          tci.applicationoriginid,
          tci.created_at,
          tci.updated_at,
          tci.positionid
        FROM t_candidate_information AS tci
      )
      SELECT
        t_applicant_information_data.id,
        t_applicant_information_data.genderid,
        t_applicant_information_data.fullname,
        t_applicant_information_data.firstname,
        t_applicant_information_data.permanentaddress,
        t_applicant_information_data.postalcode,
        t_applicant_information_data.city,
        t_applicant_information_data.countryofresidence,
        t_applicant_information_data.phone,
        t_applicant_information_data.email,
        t_applicant_information_data.languageid,
        t_applicant_information_data.applicationoriginid,
        t_applicant_information_data.created_at,
        t_applicant_information_data.updated_at,
        t_applicant_information_data.positionid,
        COALESCE(applicant_education_data.applicant_educations, '[]') AS app_educations,
        COALESCE(t_experience_data.applicant_experiences, '[]') AS app_experiences,
        COALESCE(t_resumes_data.applicant_resumes, '[]') AS app_resumes,
        COALESCE(t_cover_letter_data.applicant_cover_letters, '[]') AS app_cover_letters,
        jobs.position AS position_applied,
        t_gender.name AS gender,
        t_country.name AS country
      FROM t_applicant_information_data
      LEFT JOIN applicant_education_data ON t_applicant_information_data.id = applicant_education_data.applicant_id
      LEFT JOIN t_experience_data ON t_applicant_information_data.id = t_experience_data.applicant_id
      LEFT JOIN t_resumes_data ON t_applicant_information_data.id = t_resumes_data.applicant_id
      LEFT JOIN t_cover_letter_data ON t_applicant_information_data.id = t_cover_letter_data.applicant_id
      LEFT JOIN jobs ON t_applicant_information_data.positionid = jobs.id
      LEFT JOIN t_gender ON t_applicant_information_data.genderid = t_gender.id
      LEFT JOIN t_country ON t_applicant_information_data.countryofresidence = t_country.id;
    `;

    // Execute the query using the pool
    const { rows } = await pool.query(query);
    return rows; // Return the fetched applicant information
  } catch (err) {
    // Handle any database errors
    console.error('Database Error:', err);
    throw new Error('Failed to fetch applicant information.');
  }
}
