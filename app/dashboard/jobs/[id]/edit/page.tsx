import Form from '@/app/ui/jobs/edit-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchJobById, fetchLocations, fetchJobGroups, fetchRequirementsByJobGroupEdit, fetchResponsibilityByJobGroupEdit } from '@/app/lib/data';
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
  const group_query_edit = searchParams?.group_query_edit || '';

  console.log("group_id"+group_query_edit);




  const [job, stations, jobGroups] = await Promise.all([
    fetchJobById(id),
    fetchLocations(),
    fetchJobGroups()
  ]);

  if (!job) {
    notFound();
  }

  const requirements = await fetchRequirementsByJobGroupEdit(group_query_edit, id);
  const responsibilities = await fetchResponsibilityByJobGroupEdit(group_query_edit, id);

  return (

    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Jobs', href: '/dashboard/jobs' },
          {
            label: 'Edit Job',
            href: `/dashboard/jobs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form initialJob={job} stations={stations} job_groups={jobGroups} job_id={id} requirements={requirements} responsibilities={responsibilities} />
    </main>
  );
}