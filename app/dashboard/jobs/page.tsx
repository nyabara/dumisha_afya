import Pagination from '@/app/ui/jobs/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/jobs/table';
import { CreateJob } from '@/app/ui/jobs/buttons';
import { lusitana } from '@/app/ui/fonts';
import { JobsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchJobsPages } from '@/app/lib/data';
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchJobsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Jobs</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search jobs..." />
        <CreateJob />
      </div>
       <Suspense key={query + currentPage} fallback={<JobsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}