import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
    Vacancy,
    Requirement,
    JobCount,
    JobsTable,
    User,
    RequirementField,
    Station,
    JobForm,
    RequirementType
} from './definitions';




export async function fetchJobCount() {
  noStore
  // Add noStore() here to prevent th e response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<JobCount>`
        SELECT 
        DATE_TRUNC('month', date) AS month,
        COUNT(*) AS job_count
    FROM 
        vacancies
    WHERE 
        date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '11 months'
    GROUP BY 
        DATE_TRUNC('month', date)
    HAVING 
        COUNT(*) > 0
    ORDER BY 
        month`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch jobcount data.');
  }
}

export async function getJobs() {
  noStore
  try {
    const data = await sql<JobsTable>`
      SELECT
        vc.id,
        vc.position,
        sta.station,
        vc.date AS datecreated,
        vc.period,
        
        vc.status,
        vc.terms
      FROM
        vacancies AS vc
      LEFT JOIN
        stations as sta on vc.station_id=sta.id
    `;
    console.log('Query jobs result:', data); // Log the data object
    console.log('Rows:', data.rows);
    
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all jobs.');
  }
}

export async function fetchCardData() {
  noStore
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const jobCountPromise = sql`SELECT COUNT(*) FROM vacancies`;
    const jobStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS "pending",
         SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS "closed"
         FROM vacancies`;

    const data = await Promise.all([
      jobCountPromise,
      jobStatusPromise,
    ]);

    const numberOfJobs = Number(data[0].rows[0].count ?? '0');
    const totalPendingJobs = Number(data[1].rows[0].pending ?? '0');
    const totalClosedJobs = Number(data[1].rows[0].closed ?? '0');

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

export async function fetchFilteredJobs(query: string,currentPage: number,) {
  noStore
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try{
    
    const jobs = await sql<JobsTable>
    `SELECT
    vc.id,
    vc.position,
    sta.station,
    vc.period,
    vc.date AS datecreated,
    COALESCE(req_data.requirement, ARRAY[]::text[]) AS requirement,
    vc.status
  FROM
    vacancies AS vc
  LEFT JOIN
    stations as sta on vc.station_id=sta.id
  LEFT JOIN (
      SELECT 
          req.position_id,
          array_agg(req.requirement) AS requirement
      FROM 
          requirements AS req
      GROUP BY 
          req.position_id
      ) AS req_data ON vc.id = req_data.position_id
 
  WHERE 
    vc.position ILIKE ${`%${query}%`} OR
    sta.station ILIKE ${`%${query}%`} OR
    vc.date ::text ILIKE ${`%${query}%`} OR
    vc.status ILIKE ${`%${query}%`} OR
    array_to_string(req_data.requirement, ', ') ILIKE ${`%${query}%`}
  ORDER BY vc.date DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    return jobs.rows;
    }
    catch(error)
    {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch jobs.');
    }

}

export async function fetchJobsPages(query: string) {
  noStore
  try {
    const count = await sql`SELECT COUNT(*)
    FROM
        vacancies AS vc
      LEFT JOIN
        stations as sta on vc.station_id=sta.id
      LEFT JOIN
        requirements AS rq ON vc.id = rq.position_id
      WHERE 
        vc.position ILIKE ${`%${query}%`} OR
        sta.station ILIKE ${`%${query}%`} OR
        vc.date ::text ILIKE ${`%${query}%`} OR
        rq.requirement ILIKE ${`%${query}%`} OR
        vc.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of jobs.');
  }
}

export async function fetchRequirementTypes() {
  noStore
  try {
    const data = await sql<RequirementType>`
      SELECT
        id,
        requirement_type
      FROM requirement_types
      ORDER BY requirement_type ASC
    `;

    const requirementtypes = data.rows;
    console.log(requirementtypes);
    return requirementtypes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all requirementtypes.');
  }
}

export async function fetchRequirements() {
  noStore
  try {
    const data = await sql<RequirementField>`
      SELECT
        id,
        requirement
      FROM requirements
      ORDER BY name ASC
    `;

    const requirements = data.rows;
    console.log(requirements);
    return requirements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all requirements.');
  }
}


export async function fetchLocations() {
  noStore
  try {
    const data = await sql<Station>`
      SELECT
        id,
        station
      FROM stations
      ORDER BY station ASC
    `;

    const requirements = data.rows;
    return requirements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all locations.');
  }
}

export async function getUser(email: string) {
  noStore
    try {
      const user = await sql`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0] as User;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }


  export async function fetchJobById(id: string) {
    noStore
    try {
      
      const data = await sql<JobForm>`
        SELECT
        vacancies.id,
        vacancies.position,
        vacancies.station_id,
        vacancies.period,
        vacancies.status,
        vacancies.terms
        FROM vacancies
        WHERE vacancies.id = ${id};
      `;
  
      // const invoice = data.rows.map((invoice) => ({
      //   ...invoice,
      //   // Convert amount from cents to dollars
      //   amount: invoice.amount / 100,
      // }));
      const job= data.rows
      console.log(job);
      return job[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch job.');
    }
  }

