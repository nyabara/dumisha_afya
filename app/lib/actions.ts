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
 
  requirements: z.array(z.string().refine(value => !!value, {
    message: 'Requirement cannot be empty.',
  })).nonempty({
    message: 'Please enter at least one requirement.',
  }),
 
  responsibilities: z.array(z.string().refine(value => !!value, {
    message: 'Responsibilities cannot be empty.',
  })).nonempty({
    message: 'Please enter at least one responsibility.',
  }),
  responsibilitiesJsonString: z.string().refine(value => !!value, {
    message: '',

  }),
  requirementsJsonString: z.string().refine(value => !!value, {
    message: '',

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
  //Set the time part of today's date to 00:00:00 to only compare dates
  today.setHours(0, 0, 0, 0);
  endDateObj.setHours(0, 0, 0, 0);
  return endDateObj < today ? 'Closed' : 'Open';
};

const CreateJob = FormSchema.omit({
  id: true, date: true, status: true,
  responsibilitiesJsonString: true, requirementsJsonString: true
});

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

// Define a schema using Zod for Responsibility type
const ResponsibilitySchema = z.object({
  id: z.string(),
  responsibility: z.string(),
  position_id: z.string(),
  group_id: z.string(),
});

// Define Responsibility type
type Responsibility = z.infer<typeof ResponsibilitySchema>;

const RequirementSchema = z.object({
  id: z.string(),
  requirement: z.string(),
  position_id: z.string(),
  group_id: z.string(),
  rqtype_id: z.string(),
});

// Define Responsibility type
type Requirement = z.infer<typeof RequirementSchema>;

let parsedResponsibilities: Responsibility[] = [];
let parsedRequirements: Requirement[] = [];

export async function updateJob(id: string, formData: FormData) {

  const rqtype_id = '13d07535-c59e-4157-a011-f8d2ef4e0cbb';
  const validatedFields = UpdateJob.safeParse({
    position: formData.get('position'),
    station: formData.get('station'),
    period: formData.get('period'),
    group_id: formData.get('group_id'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    responsibilitiesJsonString: formData.get('responsibilitiesJsonString'),
    requirementsJsonString: formData.get('requirementsJsonString'),
    requirements: formData.getAll('requirements'),
    responsibilities: formData.getAll('responsibilities')
  });

  if (!validatedFields.success) {
    console.log("error");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Job.',
    };
  }

  //Prepare data for insertion into the database
  const { position, station, period, group_id, responsibilitiesJsonString, requirementsJsonString, 
    startDate, endDate, requirements, responsibilities } = validatedFields.data;

  try {

    // Parse the JSON string
    const parsedArray = JSON.parse(responsibilitiesJsonString);
    // Validate the array to ensure it's an array of objects matching the Requirement schema
    parsedResponsibilities = z.array(ResponsibilitySchema).parse(parsedArray);
   
  } catch (error) {
    console.error(`Error parsing or validating requirements: ${error}`);
  }

  try {
    // Parse the JSON string
    const parsedArray = JSON.parse(requirementsJsonString);

    // Validate the array to ensure it's an array of objects matching the Requirement schema
    parsedRequirements = z.array(RequirementSchema).parse(parsedArray);
  
  } catch (error) {
    console.error(`Error parsing or validating requirements: ${error}`);
  }

  const status = getStatus(endDate);

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
      console.log(responsibility.responsibility)
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

        // Insert associated responsibilities into the requirements table
        for (const responsibility of responsibilities) {
          await sql`
            INSERT INTO responsibilities (responsibility, position_id, group_id)
            VALUES (${responsibility}, ${id}, ${group_id})
          `;
        }
    
        // Insert associated requirements into the requirements table
        for (const requirement of requirements) {
          await sql`
            INSERT INTO requirements (requirement, position_id, group_id, rqtype_id)
            VALUES (${requirement}, ${id}, ${group_id}, ${rqtype_id})
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
  revalidatePath('/dashboard/jobs/create');
  redirect('/dashboard/jobs');

}

export async function revalidatePathOnJobGroupChange(id: string,){

  revalidatePath(`/dashboard/jobs/${id}/edit`);


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

export async function deleteResponsibility(id: string, job_id: string) {
  console.log("responsibiltydeleteid" + id);
  try {
    // Start a transaction

    await sql`DELETE FROM responsibilities WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete job.',
    };
  }
  revalidatePath(`/dashboard/jobs/${job_id}/edit`);
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs/create');
  redirect(`/dashboard/jobs/${job_id}/edit`);
}


export async function deleteQualification(id: string, job_id: string) {
  console.log("responsibiltydeleteid" + id);
  try {
    // Start a transaction

    await sql`DELETE FROM requirements WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete job.',
    };
  }
  revalidatePath(`/dashboard/jobs/${job_id}/edit`);
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs/create');
  redirect(`/dashboard/jobs/${job_id}/edit`);
}
