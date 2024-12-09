import Pagination from '@/app/ui/jobs/pagination';
import Search from '@/app/ui/search';
import ApplicantsTable from '@/app/ui/jobs/applicant-table-data';
import { CreateJob } from '@/app/ui/jobs/buttons';
import { lusitana } from '@/app/ui/fonts';
import { JobsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchJobsPages } from '@/app/lib/data';
 
export default async function Page() {
  // const query = searchApplicantParams?.query || '';
  // const currentPage = Number(searchApplicantParams?.page) || 1;
  // const totalPages = await fetchJobsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Applicants</h1>
      </div>
      {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search jobs..." />
        <CreateJob />
      </div> */}
       <Suspense key={""} fallback={<JobsTableSkeleton />}>
        <ApplicantsTable  />
      </Suspense>
      {/* <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}