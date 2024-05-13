'use client';

import { RequirementField, JobForm, LocationField } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CogIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateJob } from '@/app/lib/actions';

export default function EditJobForm({
  job,
  locations,
}: {
  job: JobForm;
  locations:LocationField[];
}) {

  console.log("jobStatus",job.status)
  const updateJobWithId = updateJob.bind(null, job.id);
  

  return (
    <form action={updateJobWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Job Title */}
        <div className="mb-4">
          <label htmlFor="jobtitle" className="mb-2 block text-sm font-medium">
            Job Position
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="jobtitle"
                name="jobtitle"
                type="string"
                defaultValue={job.jobtitle}
                placeholder="Enter Job Position"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CogIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Job Location */}
        <div className="mb-4">
          <label htmlFor="place" className="mb-2 block text-sm font-medium">
            Choose Attachment Place
          </label>
          <div className="relative">
            <select
              id="place"
              name="place"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select Place of Attachment
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Job Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the job status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={job.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="closed"
                  name="status"
                  type="radio"
                  value="closed"
                  defaultChecked={job.status === 'closed'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="closed"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Closed <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/jobs"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Job</Button>
      </div>
    </form>
  );
}
