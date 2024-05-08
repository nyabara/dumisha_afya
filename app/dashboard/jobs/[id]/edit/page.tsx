import Form from '@/app/ui/jobs/edit-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchJobById,fetchLocations } from '@/app/lib/data';
import { unstable_noStore as noStore } from 'next/cache';
 
export default async function Page({ params }: { params: { id: string } }) {
  noStore
    const id = params.id;
    const [job, locations] = await Promise.all([
        fetchJobById(id),
      
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
      <Form job={job}  locations={locations}/>
    </main>
  );
}