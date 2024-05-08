import Form from '@/app/ui/jobs/edit-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchJobById, fetchRequirements, fetchLocations } from '@/app/lib/data';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [job, requirements, locations] = await Promise.all([
        fetchJobById(id),
        fetchRequirements(),
        fetchLocations(),
      ]);
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
      <Form job={job} requirements={requirements} locations={locations}/>
    </main>
  );
}