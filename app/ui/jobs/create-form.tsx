'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Station, JobGroup, Requirement, Responsibility } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CogIcon,
  MapPinIcon,
  MoonIcon,
  BellAlertIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createJob } from '@/app/lib/actions';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'


import styles from '@/app/ui/home.module.css';
import clsx from 'clsx';
import { revalidatePath } from 'next/cache';
import { UpdateJob, DeleteJob, AddRequire, UpdateRequirement } from '@/app/ui/jobs/buttons';
import { useDebouncedCallback } from 'use-debounce';
import { generateRequirements } from '@/app/lib/utils';

export default function Form({
  stations,
  job_groups,
  requirements,
  responsibilities,
}: {
  stations: Station[];
  job_groups: JobGroup[];
  requirements: Requirement[];
  responsibilities: Responsibility[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createJob, initialState);

   //handling specific job group responsibility and requirements
   const handleJobGroup = (group_id: string) => {
    //console.log(group_id);
    const params = new URLSearchParams(searchParams);
    if (group_id) {
      params.set('group_query', group_id);
    } else {
      params.delete('group_query');
    }
    replace(`${pathname}?${params.toString()}`);
  };



  //creating job requirement logics
  const [responsibilityInputValue, setResponsibilityInputValue] = useState('');
  const [clickedResponsibilities, setClickedResponsibilities] = useState<string[]>([]);

  const handleResponsibilityClick = (id: string) => {
    setClickedResponsibilities((prevClickedResponsibilities) => [...prevClickedResponsibilities, id]);
  };

  const editJobResponsibility = (edit_responsibility: string) => {
    console.log(edit_responsibility);
    setResponsibilityInputValue(edit_responsibility);
    setClickedResponsibilities((prevClickedResponsibilities) => prevClickedResponsibilities.filter(responsibility => responsibility !== edit_responsibility));
  };

  const handleResponsibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResponsibilityInputValue(value);
  };

  const handleResponsibilityBlur = () => {
    if (responsibilityInputValue.trim() !== '') {
      setClickedResponsibilities((prevClickedResponsibilities) => [...prevClickedResponsibilities, responsibilityInputValue]);
    }
    setResponsibilityInputValue(''); // Clear input value after processing
  };
  
  //creating job requirement logics
  const [requirementInputValue, setRequirementInputValue] = useState('');
  const [clickedRequiremets, setClickedRequirements] = useState<string[]>([]);

  const handleRequirementClick = (id: string) => {
    setClickedRequirements((prevClickedRequirements) => [...prevClickedRequirements, id]);
  };

  const editJobRequirement = (edit_requirement: string) => {
    console.log(edit_requirement);
    setRequirementInputValue(edit_requirement);
    setClickedRequirements((prevClickedRequirements) => prevClickedRequirements.filter(requirement => requirement !== edit_requirement));
  };

  const handleRequirementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRequirementInputValue(value);
  };

  const handleRequirementBlur = () => {
    if (requirementInputValue.trim() !== '') {
      setClickedRequirements((prevClickedRequirements) => [...prevClickedRequirements, requirementInputValue]);
    }
    setRequirementInputValue(''); // Clear input value after processing
  };

 

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-white p-4 md:p-6 shadow-md">
        {/* Job Position */}
        <div className="mb-4">
          <label htmlFor="position" className="mb-2 block text-sm font-medium text-gray-700">Position</label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="position"
                name="position"
                placeholder="Enter Position"
                defaultValue=""
                className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                aria-describedby="position-error"
              />
              <CogIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
            </div>
          </div>
          <div id="position-error" aria-live="polite" aria-atomic="true">
            {state.errors?.position &&
              state.errors.position.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        {/* Job Station */}
        <div className="mb-4">
          <label htmlFor="station" className="mb-2 block text-sm font-medium text-gray-700">Choose Station</label>
          <div className="relative">
            <select
              id="station"
              name="station"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              defaultValue=""
              aria-describedby="station-error"
            >
              <option value="" disabled>Select Station of Attachment</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>{station.station}</option>
              ))}
            </select>
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
          </div>
          <div id="station-error" aria-live="polite" aria-atomic="true">
            {state.errors?.station &&
              state.errors.station.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        {/* Job Period */}
        <div className="mb-4">
          <label htmlFor="period" className="mb-2 block text-sm font-medium text-gray-700">Period</label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="period"
                name="period"
                placeholder="Enter Period"
                defaultValue=""
                className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                aria-describedby="period-error"
              />
              <MoonIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
            </div>
          </div>
          <div id="period-error" aria-live="polite" aria-atomic="true">
            {state.errors?.period &&
              state.errors.period.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="group_id" className="mb-2 block text-sm font-medium text-gray-700">Choose Job Group</label>
          <div className="relative">
            <select
              id="group_id"
              name="group_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              defaultValue=""
              onChange={(e) => handleJobGroup(e.target.value)}
              aria-describedby="group_id-error"
            >
              <option value="" disabled>Select Job Group</option>
              {job_groups.map((jobgroup) => (
                <option key={jobgroup.id} value={jobgroup.id}>{jobgroup.job_group}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Key Roles & Responsibilities:*/}
        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">Key Roles & Responsibilities:</label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="hidden min-w-full text-gray-900 md:table" aria-describedby="responsibilities-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Available Key Roles & Responsibilities:</th>
                          <th scope="col" className="px-3 py-5 font-medium">Added Key Roles & Responsibilities:</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="w-full border-b py-3 text-sm last-of-type:border-none">
                          <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="mb-4">
                                <label htmlFor="responsibilities" className="mb-2 block text-sm font-medium text-gray-700">Enter Key Roles & Responsibilities:</label>
                                <div className="relative mt-2 rounded-md">
                                  <textarea
                                    id="responsibilities"
                                    name="responsibilities"
                                    placeholder="Enter Key Roles & Responsibilities:"
                                    value={responsibilityInputValue}
                                    className="peer block w-full rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                    aria-describedby="responsibilities-error"
                                    onChange={handleResponsibilityChange}
                                    onBlur={handleResponsibilityBlur}
                                  />
                                </div>
                              </div>
                            </div>
                            <div aria-live="polite" aria-atomic="true">
                              <ul className="list-disc pl-6">
                                {responsibilities.map((responsibility, index) => (
                                  <li
                                    key={index}
                                    className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer ${
                                      clickedResponsibilities.includes(responsibility.responsibility)
                                        ? 'bg-blue-100 text-blue-600 pointer-events-none opacity-50'
                                        : 'bg-gray-50 hover:bg-blue-100 hover:text-blue-600'
                                    }`}
                                    onClick={() =>
                                      !clickedResponsibilities.includes(responsibility.responsibility) &&
                                      handleResponsibilityClick(responsibility.responsibility)
                                    }
                                  >
                                    <CheckIcon className="w-5" />
                                    <span>{responsibility.responsibility}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <ul className="list-disc pl-6">
                              {clickedResponsibilities.map((responsibility, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckIcon className="w-5 text-blue-600" />
                                  <span>{responsibility}</span>
                                  <input type="hidden" name="responsibilities" value={responsibility} />
                                  <PencilIcon className="w-5 text-blue-600 cursor-pointer" onClick={() => editJobResponsibility(responsibility)} />
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="requirements-error" aria-live="polite" aria-atomic="true">
            {state.errors?.requirements &&
              state.errors.requirements.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        {/* Job Requirements and Qualifications */}
        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">Job Requirements and Qualifications</label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="hidden min-w-full text-gray-900 md:table" aria-describedby="requirements-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Available Requirements</th>
                          <th scope="col" className="px-3 py-5 font-medium">Added Requirements</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="w-full border-b py-3 text-sm last-of-type:border-none">
                          <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <div className="flex items-center gap-3">
                            
                              <div className="mb-4">
                                <label htmlFor="requirement" className="mb-2 block text-sm font-medium text-gray-700">Enter Requirement</label>
                                <div className="relative mt-2 rounded-md">
                                  <textarea
                                    id="requirement"
                                    name="requirement"
                                    placeholder="Enter Requirement"
                                    value={requirementInputValue}
                                    className="peer block w-full rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                    aria-describedby="requirement-error"
                                    onChange={handleRequirementChange}
                                    onBlur={handleRequirementBlur}
                                  />
                                </div>
                              </div>
                            </div>
                            <div aria-live="polite" aria-atomic="true">
                              <ul className="list-disc pl-6">
                                {requirements.map((requirement, index) => (
                                  <li
                                    key={index}
                                    className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer ${
                                      clickedRequiremets.includes(requirement.requirement)
                                        ? 'bg-blue-100 text-blue-600 pointer-events-none opacity-50'
                                        : 'bg-gray-50 hover:bg-blue-100 hover:text-blue-600'
                                    }`}
                                    onClick={() =>
                                      !clickedRequiremets.includes(requirement.requirement) &&
                                      handleRequirementClick(requirement.requirement)
                                    }
                                  >
                                    <CheckIcon className="w-5" />
                                    <span>{requirement.requirement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <ul className="list-disc pl-6">
                              {clickedRequiremets.map((requirement, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckIcon className="w-5 text-blue-600" />
                                  <span>{requirement}</span>
                                  <input type="hidden" name="requirements" value={requirement} />
                                  <PencilIcon className="w-5 text-blue-600 cursor-pointer" onClick={() => editJobRequirement(requirement)} />
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="requirements-error" aria-live="polite" aria-atomic="true">
            {state.errors?.requirements &&
              state.errors.requirements.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        {/* Job Status */}
        {/* <fieldset>
          <legend className="mb-2 block text-sm font-medium text-gray-700">Set the Job status</legend>
          <div className="rounded-md border border-gray-300 bg-white px-[14px] py-3 shadow-sm">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-blue-500"
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
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-blue-500"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="closed"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Closed <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </fieldset> */}


        {/* Job Status */}
        <fieldset>
            <legend className="mb-2 block text-sm font-medium text-gray-700">
              Set Job Application Period
            </legend>
            <div className="rounded-md border border-gray-300 bg-white px-4 py-3 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label
                    htmlFor="startDate"
                    className="text-xs font-medium text-gray-600"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    defaultValue=""
                    // onChange={handleChange}
                    className="h-10 px-2 mt-1 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="endDate" className="text-xs font-medium text-gray-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    defaultValue=""
                    // value={formData.endDate}
                    // onChange={handleChange}
                    className="h-10 px-2 mt-1 block w-full border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            {/* Error messages section (if needed) */}
            {/* <div id="status-error" aria-live="polite" aria-atomic="true">
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-500">{errors.startDate}</p>
              )}
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div> */}
         </fieldset>


      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/jobs"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Create Job</Button>
      </div>
    </form>
  );
}
