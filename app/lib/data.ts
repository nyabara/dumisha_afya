import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
    Vacancy,
    Requirement,
    RequirementValue,
    JobsTable,
    User,
    RequirementField,
    LocationField,
    JobForm
} from './definitions';

export async function getJobs() {
  noStore
  try {
    const data = await sql<JobsTable>`
      SELECT
      vc.id,
      vc.name AS jobtitle,
      vc.place AS place,
      vc.date AS datecreated,
      rqp.name AS requirement,
      vc.status,
      rqv.name AS subject
    FROM
      vacancies AS vc
    LEFT JOIN
      requirements AS rq ON vc.id = rq.vacancy_id
    LEFT JOIN
      requirement_types AS rqp ON rq.id = rqp.requirement_id
    LEFT JOIN
      requirement_values AS rqv ON rqp.id = rqv.requirement_type_id
    `;
    console.log('Query result:', data); // Log the data object
    console.log('Rows:', data.rows);
    
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all jobs.');
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
      return job[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch job.');
    }
  }

