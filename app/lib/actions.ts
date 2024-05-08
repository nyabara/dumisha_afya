'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  place: z.string(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateJob = FormSchema.omit({ id: true, date: true });

export async function createJob(formData: FormData) { 
  // const rawFormData = {
  //   jobtitle: formData.get('jobtitle'),
  //   place: formData.get('place'),
  //   status: formData.get('status'),
  // };
  // Test it out:
  // console.log(rawFormData);

  const { name, place, status } = CreateJob.parse({
    name: formData.get('jobtitle'),
    place: formData.get('place'),
    status: formData.get('status'),
  });

  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO vacancies (name, place,status,date)
    VALUES (${name}, ${place}, ${status}, ${date})
  `;
  revalidatePath('/dashboard/jobs');
  redirect('/dashboard/jobs');

}