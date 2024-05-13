'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  place: z.string(),
  status: z.enum(['pending', 'closed']),
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
    INSERT INTO vacancies (name, location_id,status,date)
    VALUES (${name}, ${place}, ${status}, ${date})
  `;
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  redirect('/dashboard/jobs');

}


// Use Zod to update the expected types
const UpdateJob = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateJob(id: string, formData: FormData) {
  const { name, place, status } = UpdateJob.parse({
    name: formData.get('jobtitle'),
    place: formData.get('place'),
    status: formData.get('status'),
  });
 
 
  await sql`
    UPDATE vacancies
    SET name = ${name}, location_id = ${place}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/jobs/${id}/edit`);
  redirect('/dashboard/jobs');

}

export async function deleteJob(id: string) {
  await sql`DELETE FROM vacancies WHERE id = ${id}`;
  revalidatePath('/dashboard/jobs');
}