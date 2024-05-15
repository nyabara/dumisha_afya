'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';





const FormSchema = z.object({
  id: z.string(),
  jobtitle: z.string().refine(value => !!value, {
    message: 'Please enter job title.',
    
  }),
  place: z.string({
    invalid_type_error: 'Please select job location.',
  }),
  status: z.enum(['pending', 'closed'],{
    invalid_type_error: 'Please select job status.',
  }),
  date: z.string(),
});

const CreateJob = FormSchema.omit({ id: true, date: true});

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    jobtitle?: string[];
    place?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createJob(prevState: State,formData: FormData) { 

    // Validate form fields using Zod
    const validatedFields = CreateJob.safeParse({
      jobtitle: formData.get('jobtitle'),
      place: formData.get('place'),
      status: formData.get('status'),
    });


    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Job.',
      };
    }

      // Prepare data for insertion into the database
  const { jobtitle, place, status } = validatedFields.data;
  
  const date = new Date().toISOString().split('T')[0];


  try{
    await sql`
    INSERT INTO vacancies (name, location_id,status,date)
    VALUES (${jobtitle}, ${place}, ${status}, ${date})
  `;
  }catch(error){
    return {
      message: 'Database Error: Failed to Create Job.',
    };
  }
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  redirect('/dashboard/jobs');

}


// Use Zod to update the expected types
const UpdateJob = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateJob(id: string, formData: FormData) {
  const { jobtitle, place, status } = UpdateJob.parse({
    name: formData.get('jobtitle'),
    place: formData.get('place'),
    status: formData.get('status'),
  });
 
  try{
    await sql`
    UPDATE vacancies
    SET name = ${jobtitle}, location_id = ${place}, status = ${status}
    WHERE id = ${id}
  `;
  } catch(error){
    return {
      message: 'Database Error: Failed to update job.',
    };
  }
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/jobs/${id}/edit`);
  redirect('/dashboard/jobs');

}

export async function deleteJob(id: string) {
  try{
    await sql`DELETE FROM vacancies WHERE id = ${id}`;
  }catch(error){
    return {
      message: 'Database Error: Failed to delete job.',
    };
  }
  revalidatePath('/dashboard/jobs');
}