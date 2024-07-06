import Image from 'next/image';
import { UpdateJob, DeleteJob, AddRequire } from '@/app/ui/jobs/buttons';
import JobStatus from '@/app/ui/jobs/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredJobs, fetchRequirementTypes } from '@/app/lib/data';
import { CheckIcon } from '@heroicons/react/24/outline';
import styles from '@/app/ui/home.module.css';

export default async function JobsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const jobs = await fetchFilteredJobs(query, currentPage);
  const requirementypes = await fetchRequirementTypes();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {jobs?.map((job) => (
              <div
                key={job.id}
                className="mb-2 w-full rounded-md bg-white p-4 break-words"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="break-words">{job.position}</p>
                    </div>
                    <p className="text-sm text-gray-500 break-words">{job.station}</p>
                  </div>
                  <JobStatus status={job.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="break-words">{formatDateToLocal(job.datecreated)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateJob id={job.id} />
                    <DeleteJob id={job.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 break-words">
                  Position
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  Station
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  Requirements
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  Responsibilities
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3 break-words">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {jobs?.map((job) => (
                <tr
                  key={job.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-normal py-3 pl-6 pr-3 break-words">
                    <div className="flex items-center gap-3">
                      <p className="break-words">{job.position}</p>
                    </div>
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    {job.station}
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    <ul className={styles.list}>
                      {job.requirement.map((requirement, index) => (
                        <li key={index} className={styles.listItem}>
                          <CheckIcon className="w-5" />
                          <span className={styles.text}>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-end gap-3">
                      <AddRequire id={job.id} requirementypes={requirementypes} />
                    </div>
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    <ul className={styles.list}>
                      {job.responsibility.map((responsibility, index) => (
                        <li key={index} className={styles.listItem}>
                          <CheckIcon className="w-5" />
                          <span className={styles.text}>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    {formatDateToLocal(job.datecreated)}
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    <JobStatus status={job.status} />
                  </td>
                  <td className="whitespace-normal py-3 pl-6 pr-3 break-words">
                    <div className="flex justify-end gap-3">
                      <UpdateJob id={job.id} />
                      <DeleteJob id={job.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
