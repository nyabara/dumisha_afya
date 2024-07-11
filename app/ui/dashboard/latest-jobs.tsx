import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { getLatestJobs } from '@/app/lib/data';


export default async function LatestJobs() {

  const latestJobs = await getLatestJobs(); // Ensure to await the function call

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Jobs
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {<div className="bg-white px-6">
          {latestJobs.map((job, i) => {
            return (
              <div
                key={job.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold md:text-base whitespace-normal break-words">
                      {job.position}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block whitespace-normal break-words mt-1">
                      {job.station}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        </div>
      </div>
    </div>
  );

}
