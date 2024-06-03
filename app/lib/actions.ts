'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';



export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  position: z.string().refine(value => !!value, {
    message: 'Please enter job position.',
    
  }),
  station: z.string({
    invalid_type_error: 'Please select job station.',
  }),
  period: z.string().refine(value => !!value, {
    message: 'Please enter job period.',
    
  }),
  terms: z.string().refine(value => !!value, {
    message: 'Please enter job terms and conditions.',
    
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
    position?: string[];
    station?: string[];
    period?: string[];
    status?: string[];
    terms?: string[];
  };
  message?: string | null;
};

export async function createJob(prevState: State,formData: FormData) { 

    // Validate form fields using Zod
    const validatedFields = CreateJob.safeParse({

      position: formData.get('position'),
      station: formData.get('station'),
      period: formData.get('period'),
      status: formData.get('status'),
      terms: formData.get('terms'),
    });


    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Job.',
      };
    }

      // Prepare data for insertion into the database
  const { position, station,period, status,terms } = validatedFields.data;

  console.log(validatedFields.data);
  
  const date = new Date().toISOString().split('T')[0];


  try{
    await sql`
    INSERT INTO vacancies (position, station_id, period, status, terms, date)
    VALUES (${position}, ${station}, ${period}, ${status}, ${terms} ${date})
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
 
export async function updateJob(id: string, formData: FormData) {
  const { position, station, period, status, terms } = UpdateJob.parse({

    position: formData.get('position'),
    station: formData.get('station'),
    period: formData.get('period'),
    status: formData.get('status'),
    terms: formData.get('terms'),
  });
 
  try{
    await sql`
    UPDATE vacancies
    SET position = ${position}, station_id = ${station}, period =${period}, status = ${status}, terms = ${terms}
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


const RequirementFormSchema = z.object({
  id: z.string(),
  requirement: z.string().refine(value => !!value, {
    message: 'Please enter requirement.',
    
  }),
  position_id: z.string().refine(value => !!value, {
    message: 'Must have job selected.',
    
  }),
  rqvtype: z.string({
    invalid_type_error: 'Please select type.',
  }),
});


export type RqState = {
  errors?: {
    requirement?: string[];
    position_id?: string[];
    rqvtype?: string[];
  };
  message?: string | null;
};


const CreateRequirement = RequirementFormSchema.omit({ id: true});
 
export async function createRequirement(formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateRequirement.safeParse({
      requirement: formData.get('requirement'),
      position_id: formData.get('position_id'),
      rqvtype: formData.get('rqvtype'),
    });


    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Job Requirement.',
      };
    }

      // Prepare data for insertion into the database
    const { requirement,position_id, rqvtype } = validatedFields.data;



    try{
    await sql`
    INSERT INTO requirements (requirement, position_id,rqtype_id)
    VALUES (${requirement}, ${position_id}, ${rqvtype})
    `;
    }catch(error){
    return {
      message: 'Database Error: Failed to Create Job Requirement.',
    };
    }
    revalidatePath('/dashboard/jobs');
    revalidatePath('/dashboard');


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
  revalidatePath('/dashboard');
}