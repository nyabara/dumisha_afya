
import Image from 'next/image';
import { UpdateJob, DeleteJob, AddRequire } from '@/app/ui/jobs/buttons';
import JobStatus from '@/app/ui/jobs/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredJobs, fetchRequirementTypes } from '@/app/lib/data';
import {CheckIcon} from '@heroicons/react/24/outline';
import styles from '@/app/ui/home.module.css';
import { JobGroup, Requirement} from '@/app/lib/definitions';



export default async function RequirementsTable({
  job_groups,
  requirements,
}: {
  job_groups: JobGroup[];
  requirements: Requirement[];
}) {

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Available Requirements
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Added Requirements
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
            <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* Job station */}
        <div className="mb-4">
          <label htmlFor="place" className="mb-2 block text-sm font-medium">
            Choose Job Group
          </label>
          <div className="relative">
            <select
              id="station"
              name="station"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="station-error"
            >
              <option value="" disabled>
                Select Job Group
              </option>
              {/* {job_groups.map((jobgroup) => (
                <option key={jobgroup.id} value={jobgroup.id}>
                  {jobgroup.job_group}
                </option>
              ))} */}
            </select>
            {/* <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
          {/* <div id="station-error" aria-live="polite" aria-atomic="true">
            {state.errors?.station &&
              state.errors.station.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  <p>Bachelors Degree in Computer Science</p>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
