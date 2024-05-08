import Form from '@/app/ui/jobs/create-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchRequirements, fetchLocations } from '@/app/lib/data';
 
export default async function Page() {
  //const requirements= await fetchRequirements();
  const locations= await fetchLocations();
  const requirements= await fetchRequirements();
  console.log('requirements2',requirements[0].name)
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
      <Form locations={locations} requirements={requirements} />
    </main>
  );
}