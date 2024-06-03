'use client';

import { useFormState } from 'react-dom';
import { Station } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CogIcon,
  MapPinIcon,
  MoonIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createJob } from '@/app/lib/actions';
import { string } from 'zod';

export default function Form({
  stations,
  
}: {
  stations: Station[];
  
}) {
  const initialState = { message:"", errors: {} };
  const [state, dispatch] = useFormState(createJob, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Job Position */}
        <div className="mb-4">
          <label htmlFor="position" className="mb-2 block text-sm font-medium">
            Position
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="position"
                name="position"
                placeholder="Enter Position"
                defaultValue=""
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="position-error"
              />
              <CogIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="position-error" aria-live="polite" aria-atomic="true">
            {state.errors?.position &&
              state.errors.position.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Job station */}
        <div className="mb-4">
          <label htmlFor="place" className="mb-2 block text-sm font-medium">
            Choose Station
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
                Select Station of Attachment
              </option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.station}
                </option>
              ))}
            </select>
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="station-error" aria-live="polite" aria-atomic="true">
            {state.errors?.station &&
              state.errors.station.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

             {/* Job Period */}
        <div className="mb-4">
          <label htmlFor="period" className="mb-2 block text-sm font-medium">
            Period
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="period"
                name="period"
                placeholder="Enter Period"
                defaultValue=""
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="period-error"
              />
              <MoonIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="period-error" aria-live="polite" aria-atomic="true">
            {state.errors?.period &&
              state.errors.period.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


                {/* Job Terms */}
                <div className="mb-4">
          <label htmlFor="terms" className="mb-2 block text-sm font-medium">
            Terms and Conditions
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="terms"
                name="terms"
                placeholder="Enter Terms and Conditions"
                defaultValue=""
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="terms-error"
              />
              <BellAlertIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="terms-error" aria-live="polite" aria-atomic="true">
            {state.errors?.terms &&
              state.errors.terms.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Job Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the Job status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
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
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
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
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
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
        <Button type="submit">Create Job</Button>
      </div>

    </form>
  );
}
