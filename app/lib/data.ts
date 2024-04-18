import { sql } from '@vercel/postgres';
import {
    Vacancy,
    Requirement,
    RequirementType,
    RequirementValue,
    JobsTable,
    User,
} from './definitions';

export async function getJobs() {
  try {
    const data = await sql<JobsTable>`
      SELECT
        vc.id,
        vc.name as JobTitle,
        vc.place as Place,
        vc.date as DateCreated,
        rq.name as Requirement
      FROM
        vacancies as vc
      LEFT JOIN
        requirements as rq
      ON
        vc.id = rq.vacancy_id
    `;

    const jobs = data.rows;
    return jobs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all jobs.');
  }
}



export async function getUser(email: string) {
    try {
      const user = await sql`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0] as User;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }
