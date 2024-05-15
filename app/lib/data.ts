import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
    Vacancy,
    Requirement,
    JobCount,
    JobsTable,
    User,
    RequirementField,
    LocationField,
    JobForm
} from './definitions';




export async function fetchJobCount() {
  noStore
  // Add noStore() here to prevent the response from being cached.
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
        vc.name AS jobtitle,
        loc.name AS place,
        vc.date AS datecreated,
        rq.name AS requirement,
        vc.status,
        rqv.name AS subject
      FROM
        vacancies AS vc
      LEFT JOIN
        locations as loc on vc.location_id=loc.id
      LEFT JOIN
        requirements AS rq ON vc.id = rq.vacancy_id
      LEFT JOIN
        requirement_values AS rqv ON rq.id = rqv.requirement_id
    `;
    console.log('Query result:', data); // Log the data object
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
        vc.name AS jobtitle,
        loc.name AS place,
        vc.date AS datecreated,
        rq.name AS requirement,
        vc.status,
        rqv.name AS subject
      FROM
        vacancies AS vc
      LEFT JOIN
        locations as loc on vc.location_id=loc.id
      LEFT JOIN
        requirements AS rq ON vc.id = rq.vacancy_id
      LEFT JOIN
        requirement_values AS rqv ON rq.id = rqv.requirement_id
      WHERE 
        vc.name ILIKE ${`%${query}%`} OR
        loc.name ILIKE ${`%${query}%`} OR
        vc.date ::text ILIKE ${`%${query}%`} OR
        rq.name ILIKE ${`%${query}%`} OR
        vc.status ILIKE ${`%${query}%`} OR
        rqv.name ILIKE ${`%${query}%`}
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
        locations as loc on vc.location_id=loc.id
      LEFT JOIN
        requirements AS rq ON vc.id = rq.vacancy_id
      LEFT JOIN
        requirement_values AS rqv ON rq.id = rqv.requirement_id
      WHERE 
        vc.name ILIKE ${`%${query}%`} OR
        loc.name ILIKE ${`%${query}%`} OR
        vc.date ::text ILIKE ${`%${query}%`} OR
        rq.name ILIKE ${`%${query}%`} OR
        vc.status ILIKE ${`%${query}%`} OR
        rqv.name ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of jobs.');
  }
}

export async function fetchRequirements() {
  noStore
  try {
    const data = await sql<RequirementField>`
      SELECT
        id,
        name
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
    const data = await sql<LocationField>`
      SELECT
        id,
        name
      FROM locations
      ORDER BY name ASC
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
        vacancies.name as jobtitle,
        vacancies.location_id,
        vacancies.status
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

