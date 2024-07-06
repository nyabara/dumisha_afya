import Form from '@/app/ui/jobs/edit-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchJobById,fetchLocations, fetchJobGroups } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    
    const [job, stations, jobGroups] = await Promise.all([
        fetchJobById(id),
        fetchLocations(),
        fetchJobGroups(),
      ]);
      if (!job) {
        notFound();
      }
      
      console.log("jobStatus1",job.status);
      console.log("jobId",job.id);
      
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
      <Form initialJob={job}  stations={stations} job_groups={jobGroups}/>
    </main>
  );
}