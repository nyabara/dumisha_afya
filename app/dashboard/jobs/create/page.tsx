import Form from '@/app/ui/jobs/create-form';
import Breadcrumbs from '@/app/ui/jobs/breadcrumbs';
import { fetchLocations, fetchJobGroups, fetchRequirementsByJobGroup, fetchResponsibilityByJobGroup } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    group_query?: string;
  };
}) {

  const stations = await fetchLocations();
  const jobGroups = await fetchJobGroups();

  const group_query = searchParams?.group_query || '';

  const requirements = await fetchRequirementsByJobGroup(group_query);

  const responsibilities = await fetchResponsibilityByJobGroup(group_query);

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
      <Form stations={stations} job_groups={jobGroups} requirements={requirements} responsibilities={responsibilities} />
    </main>
  );
}