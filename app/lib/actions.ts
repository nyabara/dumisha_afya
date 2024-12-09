'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Pool } from 'pg'; 


// Set up your PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Use your database URL here

});



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

// export async function createJob(prevState: State, formData: FormData) {
//   // Validate form fields using Zod
//   const term_id = '06cba7c1-5ea8-42dd-8457-970ba7cba6be';
//   const rqtype_id = '13d07535-c59e-4157-a011-f8d2ef4e0cbb';

//   const validatedFields = CreateJob.safeParse({
//     position: formData.get('position'),
//     station: formData.get('station'),
//     period: formData.get('period'),
//     group_id: formData.get('group_id'),
//     startDate: formData.get('startDate'),
//     endDate: formData.get('endDate'),
//     requirements: formData.getAll('requirements'),
//     responsibilities: formData.getAll('responsibilities'),
//   });



//   if (!validatedFields.success) {
//     console.log("error");
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Job.',
//     };
//   }

//   // Prepare data for insertion into the database
//   const { position, station, period, group_id, requirements, responsibilities, startDate, endDate } = validatedFields.data;


//   console.log("responsibilities:" + responsibilities);
//   console.log("requirements:" + requirements);
//   console.log(validatedFields.data);
//   console.log(getStatus(endDate));

//   const status = getStatus(endDate);
//   const date = new Date().toISOString().split('T')[0];

//   try {
//     // Start a transaction
//     await sql`BEGIN`;

//     // Insert into the jobs table
//     const result = await sql`
//       INSERT INTO jobs (position, station_id, group_id, term_id, period, startDate,endDate,status, date)
//       VALUES (${position}, ${station}, ${group_id}, ${term_id}, ${period}, ${startDate},${endDate},${status}, ${date})
//       RETURNING id
//     `;

//     // Retrieve the newly inserted job ID
//     const jobId = (result as any).rows[0].id;

//     // Insert associated responsibilities into the requirements table
//     for (const responsibility of responsibilities) {
//       await sql`
//         INSERT INTO responsibilities (responsibility, position_id, group_id)
//         VALUES (${responsibility}, ${jobId}, ${group_id})
//       `;
//     }

//     // Insert associated requirements into the requirements table
//     for (const requirement of requirements) {
//       await sql`
//         INSERT INTO requirements (requirement, position_id, group_id, rqtype_id)
//         VALUES (${requirement}, ${jobId}, ${group_id}, ${rqtype_id})
//       `;
//     }

//     // Commit the transaction
//     await sql`COMMIT`;
//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await sql`ROLLBACK`;

//     console.error('Database Error:', error);
//     return {
//       message: 'Database Error: Failed to Create Job.',
//     };
//   }

//   // Revalidate paths and redirect after the try-catch block

//   revalidatePath('/dashboard/jobs');
//   revalidatePath('/dashboard');
//   revalidatePath('/dashboard/jobs/create');
//   redirect('/dashboard/jobs');

// }


// export async function createJob(prevState: State, formData: FormData) {
//   // Validate form fields using Zod
//   const validatedFields = CreateJob.safeParse({
//     position: formData.get('position'),
//     station: formData.get('station'),
//     group_id: formData.get('group_id'),
//     startDate: formData.get('startDate'),
//     endDate: formData.get('endDate'),
//     requirements: formData.getAll('requirements'),
//     responsibilities: formData.getAll('responsibilities'),
//   });

//   // Return errors if validation fails
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Job.',
//     };
//   }

//   const { position, station, group_id, requirements, responsibilities, startDate, endDate } = validatedFields.data;
//   const status = getStatus(endDate); // Determine job status based on endDate
//   const date = new Date().toISOString().split('T')[0];

//   try {
//     // Start transaction and insert job details
//     const result = await pool.query(
//       `
//       INSERT INTO jobs (position, station_id, group_id, startDate, endDate, status, date)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING id
//       `,
//       [position, station, group_id, startDate, endDate, status, date]
//     );

//     // Retrieve newly inserted job ID
//     const jobId = result.rows[0].id;

//     // Insert responsibilities
//     const responsibilityValues = responsibilities
//       .map(responsibility => `('${responsibility}', '${jobId}', '${group_id}')`)
//       .join(',');

//     await pool.query(`
//       INSERT INTO responsibilities (responsibility, position_id, group_id)
//       VALUES ${responsibilityValues}
//     `);

//     // Insert requirements
//     const requirementValues = requirements
//       .map(requirement => `('${requirement}', '${jobId}', '${group_id}')`)
//       .join(',');

//     await pool.query(`
//       INSERT INTO requirements (requirement, position_id, group_id)
//       VALUES ${requirementValues}
//     `);

//     // Revalidate paths to update cache after successful job creation
//     await revalidatePath('/dashboard/jobs');
//     await revalidatePath('/dashboard');
//     await revalidatePath('/dashboard/jobs/create');

//     // Redirect to the jobs dashboard
//     redirect('/dashboard/jobs');

//     return {
//       message: 'Job Created Successfully!',
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     return {
//       message: 'Database Error: Failed to Create Job.',
//     };
//   }
// }

export async function createJob(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateJob.safeParse({
    position: formData.get('position'),
    station: formData.get('station'),
    group_id: formData.get('group_id'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    requirements: formData.getAll('requirements'),
    responsibilities: formData.getAll('responsibilities'),
  });

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Job.',
    };
  }

  const { position, station, group_id, requirements, responsibilities, startDate, endDate } = validatedFields.data;
  const status = getStatus(endDate); // Determine job status based on endDate
  const date = new Date().toISOString().split('T')[0];

  try {
    // Start transaction and insert job details
    const result = await pool.query(
      `
      INSERT INTO jobs (position, station_id, group_id, startDate, endDate, status, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [position, station, group_id, startDate, endDate, status, date]
    );

    // Retrieve newly inserted job ID
    const jobId = result.rows[0].id;

    // Insert responsibilities
    const responsibilityValues = responsibilities
      .map(responsibility => `('${responsibility}', '${jobId}', '${group_id}')`)
      .join(',');

    await pool.query(`
      INSERT INTO responsibilities (responsibility, position_id, group_id)
      VALUES ${responsibilityValues}
    `);

    // Insert requirements
    const requirementValues = requirements
      .map(requirement => `('${requirement}', '${jobId}', '${group_id}')`)
      .join(',');

    await pool.query(`
      INSERT INTO requirements (requirement, position_id, group_id)
      VALUES ${requirementValues}
    `);



  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Job.',
    };
  }


      // Revalidate paths to update cache after successful job creation
      await revalidatePath('/dashboard/jobs');
      await revalidatePath('/dashboard');
      await revalidatePath('/dashboard/jobs/create');
  
      // Redirect to the jobs dashboard
      redirect('/dashboard/jobs');
}



// export async function createJob(prevState: State, formData: FormData) {
//   // Validate form fields using Zod

//   const validatedFields = CreateJob.safeParse({
//     position: formData.get('position'),
//     station: formData.get('station'),
//     group_id: formData.get('group_id'),
//     startDate: formData.get('startDate'),
//     endDate: formData.get('endDate'),
//     requirements: formData.getAll('requirements'),
//     responsibilities: formData.getAll('responsibilities'),
//   });

//   // Return errors if validation fails
//   if (!validatedFields.success) {
//     console.log('error');
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Job.',
//     };
//   }

//   // Prepare data for insertion into the database
//   const { position, station, group_id, requirements, responsibilities, startDate, endDate } = validatedFields.data;

//   console.log('responsibilities:', responsibilities);
//   console.log('requirements:', requirements);
//   console.log(validatedFields.data);
//   console.log(getStatus(endDate));

//   const status = getStatus(endDate);
//   const date = new Date().toISOString().split('T')[0];

//   try {
//     // Start a transaction
//     await pool.query('BEGIN');

//     // Insert into the jobs table
//     const result = await pool.query(
//       `INSERT INTO jobs (position, station_id, group_id,startDate, endDate, status, date)
//        VALUES ($1, $2, $3, $4, $5, $6, $7)
//        RETURNING id`,
//       [position, station, group_id, startDate, endDate, status, date]
//     );

//     // Retrieve the newly inserted job ID
//     const jobId = result.rows[0].id;

//     // Insert associated responsibilities into the responsibilities table
//     const responsibilityPromises = responsibilities.map(responsibility =>
//       pool.query(
//         `INSERT INTO responsibilities (responsibility, position_id, group_id)
//          VALUES ($1, $2, $3)`,
//         [responsibility, jobId, group_id]
//       )
//     );
//     await Promise.all(responsibilityPromises);

//     // Insert associated requirements into the requirements table
//     const requirementPromises = requirements.map(requirement =>
//       pool.query(
//         `INSERT INTO requirements (requirement, position_id, group_id)
//          VALUES ($1, $2, $3)`,
//         [requirement, jobId, group_id]
//       )
//     );
//     await Promise.all(requirementPromises);

//     // Commit the transaction
//     await pool.query('COMMIT');

//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await pool.query('ROLLBACK');
//     console.error('Database Error:', error);
//     return {
//       message: 'Database Error: Failed to Create Job.',
//     };
//   }

//   // Revalidate paths after the successful transaction
//   await revalidatePath('/dashboard/jobs');
//   await revalidatePath('/dashboard');
//   await revalidatePath('/dashboard/jobs/create');

//   // Redirect to the jobs dashboard
//   redirect('/dashboard/jobs');
// }


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
 
});

// Define Responsibility type
type Requirement = z.infer<typeof RequirementSchema>;

let parsedResponsibilities: Responsibility[] = [];
let parsedRequirements: Requirement[] = [];

// export async function updateJob(id: string, formData: FormData) {

//   const validatedFields = UpdateJob.safeParse({
//     position: formData.get('position'),
//     station: formData.get('station'),
//     group_id: formData.get('group_id'),
//     startDate: formData.get('startDate'),
//     endDate: formData.get('endDate'),
//     responsibilitiesJsonString: formData.get('responsibilitiesJsonString'),
//     requirementsJsonString: formData.get('requirementsJsonString'),
//     requirements: formData.getAll('requirements'),
//     responsibilities: formData.getAll('responsibilities')
//   });

//   if (!validatedFields.success) {
//     console.log("error");
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Job.',
//     };
//   }

//   //Prepare data for insertion into the database
//   const { position, station, group_id, responsibilitiesJsonString, requirementsJsonString,
//     startDate, endDate, requirements, responsibilities } = validatedFields.data;

//   try {

//     // Parse the JSON string
//     const parsedArray = JSON.parse(responsibilitiesJsonString);
//     // Validate the array to ensure it's an array of objects matching the Requirement schema
//     parsedResponsibilities = z.array(ResponsibilitySchema).parse(parsedArray);

//   } catch (error) {
//     console.error(`Error parsing or validating requirements: ${error}`);
//   }

//   try {
//     // Parse the JSON string
//     const parsedArray = JSON.parse(requirementsJsonString);

//     // Validate the array to ensure it's an array of objects matching the Requirement schema
//     parsedRequirements = z.array(RequirementSchema).parse(parsedArray);

//   } catch (error) {
//     console.error(`Error parsing or validating requirements: ${error}`);
//   }

//   const status = getStatus(endDate);

//   try {

//     await sql`BEGIN`;

//     const result = await sql`
//     UPDATE jobs
//     SET position = ${position}, station_id = ${station}, group_id=${group_id},
//     startDate=${startDate},endDate=${endDate},status = ${status}
//     WHERE id = ${id}
//   `;

//     // Insert associated responsibilities into the requirements table
//     for (const responsibility of parsedResponsibilities) {
//       console.log(responsibility.responsibility)
//       await sql`
//       UPDATE responsibilities
//       SET responsibility=${responsibility.responsibility}, position_id=${id}, group_id=${group_id}
//       WHERE id = ${responsibility.id}
//     `;
//     }

//     // Insert associated requirements into the requirements table
//     for (const requirement of parsedRequirements) {
//       await sql`
//       UPDATE requirements 
//       SET requirement=${requirement.requirement}, position_id=${id}, group_id=${group_id}
//       WHERE id = ${requirement.id}
//     `;
//     }

//     // Insert associated responsibilities into the requirements table
//     for (const responsibility of responsibilities) {
//       await sql`
//             INSERT INTO responsibilities (responsibility, position_id, group_id)
//             VALUES (${responsibility}, ${id}, ${group_id})
//           `;
//     }

//     // Insert associated requirements into the requirements table
//     for (const requirement of requirements) {
//       await sql`
//             INSERT INTO requirements (requirement, position_id, group_id)
//             VALUES (${requirement}, ${id}, ${group_id})
//           `;

//     }

//     await sql`COMMIT`;

//   } catch (error) {

//     // Rollback the transaction in case of an error
//     await sql`ROLLBACK`;

//     console.error('Database Error:', error);
//     return {
//       message: 'Database Error: Failed to update job.',
//     };
//   }
//   revalidatePath('/dashboard/jobs');
//   revalidatePath('/dashboard');
//   revalidatePath(`/dashboard/jobs/${id}/edit`);
//   revalidatePath('/dashboard/jobs/create');
//   redirect('/dashboard/jobs');

// }

export async function updateJob(id: string, formData: FormData) {
  // Validate form data using Zod
  const validatedFields = UpdateJob.safeParse({
    position: formData.get('position'),
    station: formData.get('station'),
    group_id: formData.get('group_id'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    responsibilitiesJsonString: formData.get('responsibilitiesJsonString'),
    requirementsJsonString: formData.get('requirementsJsonString'),
    requirements: formData.getAll('requirements'),
    responsibilities: formData.getAll('responsibilities'),
  });

  // if (!validatedFields.success) {
  //   console.log("error");
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //     message: 'Missing Fields. Failed to Update Job.',
  //   };
  // }

  if (!validatedFields.success) {
    console.log("Validation Error:", validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or Invalid Fields. Failed to Update Job.',
    };
  }
  

  // Extract validated data
  const { 
    position, 
    station, 
    group_id, 
    responsibilitiesJsonString, 
    requirementsJsonString, 
    startDate, 
    endDate, 
    requirements, 
    responsibilities 
  } = validatedFields.data;

  // let parsedResponsibilities: Responsibility[] = [];
  // let parsedRequirements: Requirement[] = [];

  // Parse and validate responsibilities
  try {
    const parsedArray = JSON.parse(responsibilitiesJsonString);
    parsedResponsibilities = z.array(ResponsibilitySchema).parse(parsedArray);
  } catch (error) {
    console.error(`Error parsing or validating responsibilities: ${error}`);
    return { message: 'Error Parsing Responsibilities JSON data.' };
  }

  // Parse and validate requirements
  try {
    const parsedArray = JSON.parse(requirementsJsonString);
    parsedRequirements = z.array(RequirementSchema).parse(parsedArray);
  } catch (error) {
    console.error(`Error parsing or validating requirements: ${error}`);
    return { message: 'Error Parsing Requirements JSON data.' };
  }

  const status = getStatus(endDate);

  try {
    // Begin the transaction
    await pool.query('BEGIN');

    // Update job details
    await pool.query(
      `UPDATE jobs
       SET position = $1, station_id = $2, group_id = $3, startDate = $4, endDate = $5, status = $6
       WHERE id = $7`,
      [position, station, group_id, startDate, endDate, status, id]
    );

    // Update existing responsibilities
    for (const responsibility of parsedResponsibilities) {
      await pool.query(
        `UPDATE responsibilities
         SET responsibility = $1, position_id = $2, group_id = $3
         WHERE id = $4`,
        [responsibility.responsibility, id, group_id, responsibility.id]
      );
    }

    // Update existing requirements
    for (const requirement of parsedRequirements) {
      await pool.query(
        `UPDATE requirements
         SET requirement = $1, position_id = $2, group_id = $3
         WHERE id = $4`,
        [requirement.requirement, id, group_id, requirement.id]
      );
    }

    // Insert new responsibilities
    for (const responsibility of responsibilities) {
      await pool.query(
        `INSERT INTO responsibilities (responsibility, position_id, group_id)
         VALUES ($1, $2, $3)`,
        [responsibility, id, group_id]
      );
    }

    // Insert new requirements
    for (const requirement of requirements) {
      await pool.query(
        `INSERT INTO requirements (requirement, position_id, group_id)
         VALUES ($1, $2, $3)`,
        [requirement, id, group_id]
      );
    }

    // Commit the transaction
    await pool.query('COMMIT');

  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to update job.',
    };
  }

  // Revalidate paths and redirect
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/jobs/${id}/edit`);
  revalidatePath('/dashboard/jobs/create');
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

// export async function deleteJob(id: string) {
//   try {
//     // Start a transaction
//     await sql`BEGIN`;

//     await sql`DELETE FROM jobs WHERE id = ${id}`;
//     await sql`DELETE FROM responsibilities WHERE position_id = ${id}`;
//     await sql`DELETE FROM requirements WHERE position_id = ${id}`;
//   } catch (error) {
//     return {
//       message: 'Database Error: Failed to delete job.',
//     };
//   }
//   revalidatePath('/dashboard/jobs');
//   revalidatePath('/dashboard');
//   revalidatePath('/dashboard/jobs/create');
// }

export async function deleteJob(id: string) {
  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Delete job-related responsibilities
    await pool.query(`
      DELETE FROM responsibilities WHERE position_id = $1
    `, [id]);

    // Delete job-related requirements
    await pool.query(`
      DELETE FROM requirements WHERE position_id = $1
    `, [id]);

    // Delete the job itself
    await pool.query(`
      DELETE FROM jobs WHERE id = $1
    `, [id]);

    // Commit the transaction
    await pool.query('COMMIT');

    // Revalidate paths to ensure UI updates


    // return {
    //   message: 'Job deleted successfully!',
    // };
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    console.error('Database Error:', error);
    
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







const EducationSchema = z.object({
  id: z.string(),
  applicant_id: z.string(),
  education_level_id: z.string(),
  degree_name_id: z.string(),
  subject_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  institution_name: z.string(),
  is_highest_level: z.boolean(),
});

const ExperienceSchema = z.object({
  id: z.string(),
  applicant_id: z.string(),
  job_title: z.string(),
  company_name: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),  // Optional if current_workplace is true
  description: z.string(),
  current_workplace: z.boolean(),  // Add current_workplace as a boolean field
});




const ResumeSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  applicant_id: z.string(),

});



const CoverLetterSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  applicant_id: z.string(),

});
// Define Education type
type Education = z.infer<typeof EducationSchema>;

type Experience = z.infer<typeof ExperienceSchema>;

type Resume = z.infer<typeof ResumeSchema>;

type CoverLetter = z.infer<typeof CoverLetterSchema>;


let parsedEducations: Education[] = [];
let parsedExperiences: Experience[] = [];

let parsedResumes: Resume[] = [];
let parsedCoverLetters: CoverLetter[] = [];



const ApplicationFormSchema = z.object({

  id: z.string(),
  positionid: z.string({
    invalid_type_error: 'Please enter job position.',

  }),
  genderid: z.string({
    invalid_type_error: 'Please select your gender.',
  }),
  fullname: z.string().refine(value => !!value, {
    message: 'Please enter your full name.',

  }),
  firstname: z.string().refine(value => !!value, {
    message: 'Please enter your first name.',

  }),
  permanentaddress: z.string().refine(value => !!value, {
    message: 'Please enter your permanentaddress.',

  }),
  postalcode: z.string().refine(value => !!value, {
    message: 'Please enter your postalcode.',

  }),
  city: z.string().refine(value => !!value, {
    message: 'Please enter your city.',

  }),
  countryofresidence: z.string({
    invalid_type_error: 'Please select your countryofresidence'
  }),

  email: z.string().refine(value => !!value, {
    message: 'Please enter your email.',

  }),

  phone: z.string().refine(value => !!value, {
    message: 'Please enter your phone.',

  }),
  languageid: z.string({
    invalid_type_error: 'Please select your language 1'
  }),
  languageid2: z.string({
    invalid_type_error: 'Please select your language 2'
  }),

  experience: z.string().refine(value => !!value, {
    message: 'Please enter your experience.',

  }),
  applicationoriginid: z.string({
    invalid_type_error: 'Please select your application origin'
  }),
  education: z.string().refine(value => !!value, {
    message: 'Please enter your education.',

  }),

  resume: z.string().refine(value => !!value, {
    message: 'Please upload your resumes.',

  }),

  coverletter: z.string().refine(value => !!value, {
    message: 'Please upload your coverletter.',

  }),


});



// This is temporary until @types/react-dom is updated
export type ApplicationState = {
  errors?: {
    //positionid?: string[];
    genderid?: string[];
    fullname?: string[];
    firstname?: string[];
    permanentaddress?: string[];
    postalcode?: string[];
    city?: string[];
    countryofresidence?: string[];
    email?: string[];
    phone?: string[];
    languageid?: string[];
    languageid2?: string[];
    //experience?: string[];
    applicationoriginid?: string[];
    //education?: string[];
    //resume?: string[];
    //coverletter?: string[];
  };
  message?: string | null;
};


const CreateApplication = ApplicationFormSchema.omit({
  id: true
});




// export async function createApplication(prevState: ApplicationState | undefined, formData: FormData) {

//   //Validate form fields using ZOD
//   const validatedFields = CreateApplication.safeParse({


//     positionid: formData.get('positionid'),
//     genderid: formData.get('genderid'),
//     fullname: formData.get('fullname'),
//     firstname: formData.get('firstname'),
//     permanentaddress: formData.get('permanentaddress'),
//     postalcode: formData.get('postalcode'),
//     city: formData.get('city'),
//     countryofresidence: formData.get('countryofresidence'),
//     email: formData.get('email'),
//     phone: formData.get('phone'),
//     languageid1: formData.get('languageid1'),
//     languageid2: formData.get('languageid2'),
//     experience: formData.get('experience'),
//     applicationoriginid: formData.get('applicationoriginid'),
//     education: formData.get('education'),
//     resume: formData.get('resume'),
//     coverletter: formData.get('coverletter'),

//   });


//   if (!validatedFields.success) {
//     console.log("error");
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Application.',
//     };
//   }


//   // Prepare data for insertion into the database
//   const { 
//     positionid, genderid, fullname, firstname, permanentaddress, postalcode, city, countryofresidence,
//     email, phone, languageid1, languageid2, experience, applicationoriginid, education, resume, coverletter } = validatedFields.data;



//   try {

//     // Parse the JSON string
//     const parsedEducationArray = JSON.parse(education);
//     // Validate the array to ensure it's an array of objects matching the Education schema
//     parsedEducations = z.array(EducationSchema).parse(parsedEducationArray);

//   } catch (error) {
//     console.error(`Error parsing or validating educations: ${error}`);
//   }

//   try {
//     // Parse the JSON string
//     const parsedExperienceArray = JSON.parse(experience);

//     // Validate the array to ensure it's an array of objects matching the Experience schema
//     parsedExperiences = z.array(ExperienceSchema).parse(parsedExperienceArray);

//   } catch (error) {
//     console.error(`Error parsing or validating experiences: ${error}`);
//   }

//   try {

//     // Parse the JSON string
//     const parsedResumeArray = JSON.parse(resume);
//     // Validate the array to ensure it's an array of objects matching the Resume schema
//     parsedResumes = z.array(ResumeSchema).parse(parsedResumeArray);

//   } catch (error) {
//     console.error(`Error parsing or validating resumes: ${error}`);
//   }

//   try {
//     // Parse the JSON string
//     const parsedCoverLetterArray = JSON.parse(coverletter);

//     // Validate the array to ensure it's an array of objects matching the CoverLetter schema
//     parsedCoverLetters = z.array(CoverLetterSchema).parse(parsedCoverLetterArray);

//   } catch (error) {
//     console.error(`Error parsing or validating coverletters: ${error}`);
//   }


//   try {
//     // Start a transaction
//     await sql`BEGIN`;

//     // Insert into the t_candidate_information table


//     const result = await sql`
//         INSERT INTO t_candidate_information (genderid, fullname, firstname, permanentaddress, postalcode, 
//         city,countryofresidence,phone, email, languageid1,languageid2, applicationoriginid, positionid )
//         VALUES (${genderid}, ${fullname}, ${firstname}, ${permanentaddress}, ${postalcode}, ${city},
//         ${countryofresidence},${phone}, ${email}, ${languageid1}, ${languageid2}, ${applicationoriginid}, ${positionid})
//         RETURNING id
//       `;

//     // Retrieve the newly inserted applicant ID
//     const applicant_id = (result as any).rows[0].id;



//     // Insert associated educations into the t_applicant_education table
//     for (const education of parsedEducations) {

//       console.log("===Education Information====");
//       console.log("Applicant ID:" + applicant_id);
//       console.log("education_level_id:" + education.education_level_id);
//       console.log("degree_name_id:" + education.degree_name_id);
//       console.log("subject_id:" + education.subject_id);
//       console.log("start_date:" + education.start_date);
//       console.log("end_date:" + education.end_date);
//       console.log("institution_name:" + education.institution_name);
//       console.log("institution_name:" + education.is_highest_level);

//       await sql`
//           INSERT INTO t_applicant_education (applicant_id, education_level_id, degree_name_id, 
//           start_date, end_date, institution_name, is_highest_level)
//           VALUES (${applicant_id}, ${education.education_level_id}, ${education.degree_name_id},
//            ${education.start_date}, ${education.end_date}, ${education.institution_name}, ${education.is_highest_level})
//         `;
//     }

//     // Insert associated experiences into the t_experience table
//     for (const experience of parsedExperiences) {

//       console.log("===Experience Information====");
//       console.log("Applicant ID:" + applicant_id);
//       console.log("job_title:" + experience.job_title);
//       console.log("company_name:" + experience.company_name);
//       console.log("start_date:" + experience.start_date);
//       console.log("end_date:" + experience.end_date);
//       console.log("description:" + experience.description);
//       console.log("description:" + experience.current_workplace);


//       await sql`
//           INSERT INTO t_experience (applicant_id, job_title, company_name, start_date, end_date, description, current_workplace)
//           VALUES (${applicant_id}, ${experience.job_title}, ${experience.company_name}, ${experience.start_date},
//            ${experience.end_date},  ${experience.description}, ${experience.current_workplace})
//         `;
//     }


//     // Insert associated resumes into the t_resumes table
//     for (const resume of parsedResumes) {

//       console.log("===Resume Information====");
//       console.log("name" + resume.name);
//       console.log("url:" + resume.url);
//       console.log("applicant_id:" + applicant_id);


//       await sql`
//           INSERT INTO t_resumes (name, url, applicant_id)
//           VALUES (${resume.name}, ${resume.url}, ${applicant_id})
//         `;
//     }

//     for (const coverletter of parsedCoverLetters) {

//       console.log("===Cover Letter Information====");
//       console.log("name" + coverletter.name);
//       console.log("url:" + coverletter.url);
//       console.log("applicant_id:" + applicant_id);

//       await sql`
//           INSERT INTO t_cover_letter (name, url, applicant_id)
//           VALUES (${coverletter.name}, ${coverletter.url}, ${applicant_id})
//         `;
//     }

//     // Commit the transaction
//     await sql`COMMIT`;
//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await sql`ROLLBACK`;

//     console.error('Database Error:', error);

//     if (error instanceof Error && 'code' in error) {
//       switch (error.code) { // Use error.code instead of error.message
//         case '23505':
//           return { message: 'A record with this information already exists. Please check your input and try again.' };
//         case '23503':
//           return { message: 'The reference to another record is invalid. Please ensure that all related records exist.' };
//         // Handle other cases based on error codes
//         default:
//           return { message: 'An unexpected error occurred. Please try again later.' };
//       }
//     } else {
//       // Handle non-Error types if needed
//       return { message: 'An unknown error occurred. Please try again later.' };
//     }
//   }

//   // Revalidate paths and redirect after the try-catch block

// }


export async function createApplication(prevState: ApplicationState | undefined, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateApplication.safeParse({
    positionid: formData.get('positionid'),
    genderid: formData.get('genderid'),
    fullname: formData.get('fullname'),
    firstname: formData.get('firstname'),
    permanentaddress: formData.get('permanentaddress'),
    postalcode: formData.get('postalcode'),
    city: formData.get('city'),
    countryofresidence: formData.get('countryofresidence'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    languageid: formData.get('languageid1'),
    languageid2: formData.get('languageid2'),
    experience: formData.get('experience'),
    applicationoriginid: formData.get('applicationoriginid'),
    education: formData.get('education'),
    resume: formData.get('resume'),
    coverletter: formData.get('coverletter'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Application.',
    };
  }

  const {
    positionid, genderid, fullname, firstname, permanentaddress, postalcode, city, countryofresidence,
    email, phone, languageid, languageid2, experience, applicationoriginid, education, resume, coverletter
  } = validatedFields.data;

  try {
    parsedEducations = JSON.parse(education);
    parsedExperiences = JSON.parse(experience);
    parsedResumes = JSON.parse(resume);
    parsedCoverLetters = JSON.parse(coverletter);
  } catch (error) {
    console.error('Error parsing or validating JSON fields:', error);
    return { message: 'Invalid data format. Please ensure fields are in correct format.' };
  }

  try {
    await pool.query('BEGIN');

    // Insert into `t_candidate_information`
    const result = await pool.query(
      `INSERT INTO t_candidate_information 
      (positionid,genderid, fullname, firstname, permanentaddress, postalcode, city, countryofresidence, phone, email, languageid, applicationoriginid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [positionid,genderid, fullname, firstname, permanentaddress, postalcode, city, countryofresidence, phone, email, languageid, applicationoriginid]
    );
    const applicant_id = result.rows[0].id;

    // Insert associated education records
    // for (const education of parsedEducations) {
    //   await pool.query(
    //     `INSERT INTO t_applicant_education (applicant_id, education_level_id, degree_name_id, start_date, end_date, institution_name, is_highest_level)
    //     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    //     [applicant_id, education.education_level_id, education.degree_name_id, education.start_date, education.end_date, education.institution_name, education.is_highest_level]
    //   );
    // }
    for (const education of parsedEducations) {
      await pool.query(
        `INSERT INTO t_applicant_education (
          applicant_id, education_level_id, degree_name_id, start_date, end_date, institution_name, is_highest_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          applicant_id,
          education.education_level_id,
          education.degree_name_id,
          education.start_date || null, // Use null if start_date is empty or undefined
          education.end_date || null,   // Use null if end_date is empty or undefined
          education.institution_name,
          education.is_highest_level
        ]
      );
    }
    

    // Insert associated experience records
    // for (const experience of parsedExperiences) {
    //   await pool.query(
    //     `INSERT INTO t_experience (applicant_id, job_title, company_name, start_date, end_date, description, current_workplace)
    //     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    //     [applicant_id, experience.job_title, experience.company_name, experience.start_date, experience.end_date, experience.description, experience.current_workplace]
    //   );
    // }

    for (const experience of parsedExperiences) {
      await pool.query(
        `INSERT INTO t_experience (
          applicant_id, job_title, company_name, start_date, end_date, description, current_workplace
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          applicant_id,
          experience.job_title,
          experience.company_name,
          experience.start_date || null, // Set to null if start_date is empty or undefined
          experience.end_date || null,   // Set to null if end_date is empty or undefined
          experience.description,
          experience.current_workplace
        ]
      );
    }
    

    // Insert associated resume records
    for (const resume of parsedResumes) {
      await pool.query(
        `INSERT INTO t_resumes (name, url, applicant_id)
        VALUES ($1, $2, $3)`,
        [resume.name, resume.url, applicant_id]
      );
    }

    // Insert associated cover letter records
    for (const coverletter of parsedCoverLetters) {
      await pool.query(
        `INSERT INTO t_cover_letter (name, url, applicant_id)
        VALUES ($1, $2, $3)`,
        [coverletter.name, coverletter.url, applicant_id]
      );
    }

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Application.' };
  }

  return { message: 'Application successfully created.' };
}
