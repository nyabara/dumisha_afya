'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Requirement, Responsibility } from '@/app/lib/definitions';


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
  group_id: z.string({
    invalid_type_error: 'Please select job group'
  }),

  startDate: z.string().refine(value => !!value, {
    message: 'Please enter start date.',

  }),

  endDate: z.string().refine(value => !!value, {
    message: 'Please enter end date.',

  }),

  date: z.string(),
  status: z.string(),
  // Including an array of non-empty strings
  requirements: z.array(z.string().refine(value => !!value, {
    message: 'Requirement cannot be empty.',
  })).nonempty({
    message: 'Please enter at least one requirement.',
  }),
  // Including an array of non-empty strings
  responsibilities: z.array(z.string().refine(value => !!value, {
    message: 'Responsibilities cannot be empty.',
  })).nonempty({
    message: 'Please enter at least one responsibility.',
  }),
});



// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    position?: string[];
    station?: string[];
    group_id?: string[];
    period?: string[];
    startDate?: string[];
    endDate?: string[];
    requirements?: string[];
    responsibilities?: string[];
  };
  message?: string | null;
};


const getStatus = (endDate: string): string => {
  const today: Date = new Date();
  const endDateObj: Date = new Date(endDate);
  // Set the time part of today's date to 00:00:00 to only compare dates
  today.setHours(0, 0, 0, 0);
  endDateObj.setHours(0, 0, 0, 0);
  return endDateObj < today ? 'Closed' : 'Open';
};

const CreateJob = FormSchema.omit({ id: true, date: true, status: true });
export async function createJob(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const term_id = '06cba7c1-5ea8-42dd-8457-970ba7cba6be';
  const rqtype_id = '13d07535-c59e-4157-a011-f8d2ef4e0cbb';

  const validatedFields = CreateJob.safeParse({
    position: formData.get('position'),
    station: formData.get('station'),
    period: formData.get('period'),
    group_id: formData.get('group_id'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    requirements: formData.getAll('requirements'),
    responsibilities: formData.getAll('responsibilities'),
  });

  //console.log(startDate)

  if (!validatedFields.success) {
    console.log("error");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Job.',
    };
  }

  // Prepare data for insertion into the database
  const { position, station, period, group_id, requirements, responsibilities, startDate, endDate } = validatedFields.data;


  console.log("responsibilities:" + responsibilities);
  console.log("requirements:" + requirements);
  console.log(validatedFields.data);
  console.log(getStatus(endDate));

  const status = getStatus(endDate);
  const date = new Date().toISOString().split('T')[0];

  try {
    // Start a transaction
    await sql`BEGIN`;

    // Insert into the jobs table
    const result = await sql`
      INSERT INTO jobs (position, station_id, group_id, term_id, period, startDate,endDate,status, date)
      VALUES (${position}, ${station}, ${group_id}, ${term_id}, ${period}, ${startDate},${endDate},${status}, ${date})
      RETURNING id
    `;

    // Retrieve the newly inserted job ID
    const jobId = (result as any).rows[0].id;

    // Insert associated responsibilities into the requirements table
    for (const responsibility of responsibilities) {
      await sql`
        INSERT INTO responsibilities (responsibility, position_id, group_id)
        VALUES (${responsibility}, ${jobId}, ${group_id})
      `;
    }

    // Insert associated requirements into the requirements table
    for (const requirement of requirements) {
      await sql`
        INSERT INTO requirements (requirement, position_id, group_id, rqtype_id)
        VALUES (${requirement}, ${jobId}, ${group_id}, ${rqtype_id})
      `;
    }

    // Commit the transaction
    await sql`COMMIT`;
  } catch (error) {
    // Rollback the transaction in case of an error
    await sql`ROLLBACK`;

    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Job.',
    };
  }

  // Revalidate paths and redirect after the try-catch block

  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs/create');
  redirect('/dashboard/jobs');

}




// Use Zod to update the expected types
const UpdateJob = FormSchema.omit({ id: true, date: true, status: true });

export async function updateJob(id: string, formData: FormData) {
  const validatedFields = UpdateJob.safeParse({
    position: formData.get('position'),
    station: formData.get('station'),
    period: formData.get('period'),
    group_id: formData.get('group_id'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    requirements: formData.getAll('requirements'),
    responsibilities: formData.getAll('responsibilities'),
  });

  //console.log(startDate)

  if (!validatedFields.success) {
    console.log("error");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Job.',
    };
  }

  // Prepare data for insertion into the database
  const { position, station, period, group_id, requirements, responsibilities, startDate, endDate } = validatedFields.data;

  // Parse the responsibilities array
  const parsedResponsibilities: Responsibility[] = responsibilities.map((responsibility) =>
    JSON.parse(responsibility) as Responsibility
  );

  // Log each responsibility's description
  for (const respo of parsedResponsibilities) {
    console.log(respo.responsibility); // Assuming 'description' is a field in Responsibility
  }


  // Parse the requirements array
  const parsedRequirements: Requirement[] = requirements.map((requirement) =>
    JSON.parse(requirement) as Requirement
  );

  // Log each responsibility's description
  for (const req of parsedRequirements) {
    console.log(req.requirement); // Assuming 'description' is a field in Responsibility
  }



  console.log("responsibilities:" + responsibilities);
  // console.log("requirements:" + requirements);
  // console.log(validatedFields.data);
  // console.log(getStatus(endDate));

  const status = getStatus(endDate);
  const date = new Date().toISOString().split('T')[0];

  try {

    await sql`BEGIN`;

    const result = await sql`
    UPDATE jobs
    SET position = ${position}, station_id = ${station}, group_id=${group_id},period =${period}, 
    startDate=${startDate},endDate=${endDate},status = ${status}
    WHERE id = ${id}
  `;

    // Insert associated responsibilities into the requirements table
    for (const responsibility of parsedResponsibilities) {
      await sql`
      UPDATE responsibilities
      SET responsibility=${responsibility.responsibility}, position_id=${id}, group_id=${group_id}
      WHERE id = ${responsibility.id}
    `;
    }

    // Insert associated requirements into the requirements table
    for (const requirement of parsedRequirements) {
      await sql`
      UPDATE requirements 
      SET requirement=${requirement.requirement}, position_id=${id}, group_id=${group_id}
      WHERE id = ${requirement.id}
    `;
    }

    await sql`COMMIT`;

  } catch (error) {

    // Rollback the transaction in case of an error
    await sql`ROLLBACK`;

    console.error('Database Error:', error);
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


const CreateRequirement = RequirementFormSchema.omit({ id: true });

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
  const { requirement, position_id, rqvtype } = validatedFields.data;



  try {
    await sql`
    INSERT INTO requirements (requirement, position_id,rqtype_id)
    VALUES (${requirement}, ${position_id}, ${rqvtype})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Job Requirement.',
    };
  }
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');


}

export async function deleteJob(id: string) {
  try {
    // Start a transaction
    await sql`BEGIN`;

    await sql`DELETE FROM jobs WHERE id = ${id}`;
    await sql`DELETE FROM responsibilities WHERE position_id = ${id}`;
    await sql`DELETE FROM requirements WHERE position_id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete job.',
    };
  }
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs/create');
}