import Form from '@/app/ui/jobs/create-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchLocations } from '@/app/lib/data';
 
export default async function Page() {
  //const requirements= await fetchRequirements();
  const stations= await fetchLocations();
 // const requirements= await fetchRequirements();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Jobs', href: '/dashboard/jobs' },
          {
            label: 'Create Job',
            href: '/dashboard/jobs/create',
            active: true,
          },
        ]}
      />
      <Form stations={stations} />
    </main>
  );
}