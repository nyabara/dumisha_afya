import Form from '@/app/ui/jobs/edit-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchJobById,fetchLocations, fetchJobGroups,fetchRequirementsByJobGroup,fetchResponsibilityByJobGroup } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string, group_query_edit?:string } }) {
    const id = params.id;
    const group_query_edit = params?.group_query_edit || '';

    
    
    const [job, stations, jobGroups] = await Promise.all([
        fetchJobById(id),
        fetchLocations(),
        fetchJobGroups()
      ]);
    const requirements = await fetchRequirementsByJobGroup(group_query_edit);
    const responsibilities = await fetchResponsibilityByJobGroup(group_query_edit);
      if (!job) {
        notFound();
      }
      
   
      
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
      <Form initialJob={job}  stations={stations} job_groups={jobGroups} job_id={id} requirements={requirements} responsibilities={responsibilities}/>
    </main>
  );
}