import Form from '@/app/ui/applications/application-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { 
  fetchJobById, 
  fetchGender, 
  fetchCountries, 
  fetchLanguages, 
  fetchEducationLevel, 
  fetchDegreeName, 
  fetchApplicationOrigin } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({
  params, searchParams, 
}:{ 
  params: { 
    id: string, 
  };
  searchParams?: { 
     group_query_edit: string 
  };
}) {


  const id = params.id;


  const [job, gender, countries, languages, educationLevels, applicationOrigins, degreeName] = await Promise.all([
    fetchJobById(id),
    fetchGender(),
    fetchCountries(),
    fetchLanguages(),
    fetchEducationLevel(),
    fetchApplicationOrigin(),
    fetchDegreeName()

  ]);


  if (!job||!gender||!countries||!languages||!educationLevels||!applicationOrigins||!degreeName) {
    notFound();
  }

  return (

    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Jobs', href: '/dashboard/jobs' },
          {
            label: 'Job Offer',
            href: `/dashboard/jobs/${id}/applications`,
            active: true,
          },
        ]}
      />
    <Form initialJob={job} gender={gender} countries={countries} languages={languages} 
    educationLevels={educationLevels} applicationOrigins={applicationOrigins} degreeName={degreeName}/>
    
    </main>
  );

  }