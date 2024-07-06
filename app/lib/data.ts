import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
    JobCount,
    JobsTable,
    User,
    Requirement,
    Station,
    JobForm,
    RequirementType,
    JobGroup,
    Responsibility
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
        jobs
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
        jb.id,
        jb.position,
        sta.station,
        jbg.job_group,
        jb.date AS datecreated,
        jb.period,
        jb.status,
        tms.term
      FROM
        jobs AS jb
      LEFT JOIN
        stations as sta on jb.station_id=sta.id
      LEFT JOIN 
        job_groups as jbg on jb.group_id=jbg.id
      LEFT JOIN
        terms as tms on jb.term_id=tms.id
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
    const jobCountPromise = sql`SELECT COUNT(*) FROM jobs`;
    const jobStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS "pending",
         SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS "closed"
         FROM jobs`;

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
    
    const jobs = await sql<JobsTable>`
      SELECT
        jb.id,
        jb.position,
        sta.station,
        jbg.job_group,
        jb.period,
        jb.date AS datecreated,
        COALESCE(req_data.requirement, ARRAY[]::text[]) AS requirement,
        COALESCE(resp_data.responsibility, ARRAY[]::text[]) AS responsibility,
        jb.status
      FROM
        jobs AS jb
      LEFT JOIN
        stations as sta on jb.station_id=sta.id
      LEFT JOIN 
        job_groups as jbg on jb.group_id=jbg.id
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
      ) AS resp_data ON jb.id = req_data.position_id
 
      WHERE 
        jb.position ILIKE ${`%${query}%`} OR
        sta.station ILIKE ${`%${query}%`} OR
        jb.date ::text ILIKE ${`%${query}%`} OR
        jb.status ILIKE ${`%${query}%`} OR
        array_to_string(req_data.requirement, ', ') ILIKE ${`%${query}%`}
      ORDER BY jb.date DESC
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
    const count = await sql`
      SELECT 
        COUNT(*)
      FROM
        jobs AS jb
      LEFT JOIN
        stations as sta on jb.station_id=sta.id
      LEFT JOIN
        requirements AS rq ON jb.id = rq.position_id
      WHERE 
        jb.position ILIKE ${`%${query}%`} OR
        sta.station ILIKE ${`%${query}%`} OR
        jb.date ::text ILIKE ${`%${query}%`} OR
        rq.requirement ILIKE ${`%${query}%`} OR
        jb.status ILIKE ${`%${query}%`}
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
    const data = await sql<Requirement>`
      SELECT
        id,
        position_id,
        requirement,
        rqtype_id
      FROM requirements
      ORDER BY requirement ASC
    `;

    const requirements = data.rows;
    console.log(requirements);
    return requirements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all requirements.');
  }
}

export async function fetchJobGroups() {
  noStore
  try {
    const data = await sql<JobGroup>`
      SELECT
        id,
        job_group
      FROM job_groups
      ORDER BY job_group ASC
    `;

    const jobGroups = data.rows;
    console.log(jobGroups);
    return jobGroups;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all jobGroups.');
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
        WHERE jobs.id = ${id}
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
    
      const job= data.rows
      console.log(job);
      return job[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch job.');
    }
  }


  export async function fetchRequirementsByJobGroup(id: string) {
    noStore
    if (id){
      try {
        const data = await sql<Requirement>`
          SELECT
            requirements.id,
            requirements.requirement,
            requirements.position_id,
            requirements.group_id,
            requirements.rqtype_id
          FROM requirements
          WHERE requirements.group_id = ${id};
        `;
    
        const requirements = data.rows;
        console.log(requirements);
        return requirements;
      } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all requirements.');
      }

    }else{
      try {
        const data = await sql<Requirement>`
          SELECT
            requirements.id,
            requirements.requirement,
            requirements.position_id,
            requirements.group_id,
            requirements.rqtype_id
          FROM requirements
        `;
    
        const requirements = data.rows;
        console.log(requirements);
        return requirements;
      } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all requirements.');
      }
    }
  
  }


  export async function fetchResponsibilityByJobGroup(id: string) {
    noStore
    if (id){
      try {
        const data = await sql<Responsibility>`
          SELECT
            responsibilities.id,
            responsibilities.responsibility,
            responsibilities.position_id,
            responsibilities.group_id
          FROM responsibilities
          WHERE responsibilities.group_id = ${id};
        `;
    
        const responsibilities = data.rows;
        console.log(responsibilities);
        return responsibilities;
      } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all responsibilities.');
      }

    }else{
      try {
        const data = await sql<Responsibility>`
          SELECT
            responsibilities.id,
            responsibilities.responsibility,
            responsibilities.position_id,
            responsibilities.group_id
          FROM responsibilities
        `;
    
        const responsibilities = data.rows;
        console.log(responsibilities);
        return responsibilities;
      } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all responsibilities.');
      }
    }
  
  }

