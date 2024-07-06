'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Station, JobGroup, Requirement, Responsibility } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  CogIcon,
  MapPinIcon,
  MoonIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createJob } from '@/app/lib/actions';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';

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

  // Handling specific job group responsibility and requirements
  const handleJobGroup = (group_id: string) => {
    const params = new URLSearchParams(searchParams);
    if (group_id) {
      params.set('group_query', group_id);
    } else {
      params.delete('group_query');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Creating job key roles and responsibilities logics
  const [responsibilityInputValue, setResponsibilityInputValue] = useState<string>('');
  const [clickedResponsibilities, setClickedResponsibilities] = useState<string[]>([]);

  const handleResponsibilityClick = (id: string) => {
    setClickedResponsibilities((prevClickedResponsibilities) => [...prevClickedResponsibilities, id]);
  };

  const editJobResponsibility = (edit_responsibility: string) => {
    setResponsibilityInputValue(edit_responsibility);
    setClickedResponsibilities((prevClickedResponsibilities) =>
      prevClickedResponsibilities.filter(responsibility => responsibility !== edit_responsibility)
    );
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

  const handleAddAllResponsibilities = () => {
    const availableResponsibilities = responsibilities
      .map(responsibility => responsibility.responsibility)
      .filter(responsibility => !clickedResponsibilities.includes(responsibility));
    setClickedResponsibilities(prevClickedResponsibilities => [...prevClickedResponsibilities, ...availableResponsibilities]);
  };

  const handleDeleteResponsibility = (delete_responsibility: string) => {
    setClickedResponsibilities((prevClickedResponsibilities) =>
      prevClickedResponsibilities.filter(responsibility => responsibility !== delete_responsibility)
    );
  };

  const handleDeleteAllResponsibilities = () => {
    setClickedResponsibilities([]);
  };
  // Creating job requirement logics

  const [requirementInputValue, setRequirementInputValue] = useState<string>('');
  const [clickedRequirements, setClickedRequirements] = useState<string[]>([]);

  const handleRequirementClick = (id: string) => {
    setClickedRequirements((prevClickedRequirements) => [...prevClickedRequirements, id]);
  };

  const editJobRequirement = (edit_requirement: string) => {
    setRequirementInputValue(edit_requirement);
    setClickedRequirements((prevClickedRequirements) =>
      prevClickedRequirements.filter(requirement => requirement !== edit_requirement)
    );
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

  const handleAddAllRequirements = () => {
    const availableRequirements = requirements
      .map(requirement => requirement.requirement)
      .filter(requirement => !clickedRequirements.includes(requirement));
    setClickedRequirements(prevClickedRequirements => [...prevClickedRequirements, ...availableRequirements]);
  };

  const handleDeleteRequirement = (delete_requirement: string) => {
    setClickedRequirements((prevClickedRequirements) =>
      prevClickedRequirements.filter(requirement => requirement !== delete_requirement)
    );
  };

  const handleDeleteAllRequirements = () => {
    setClickedRequirements([]);
  };


  // Job Application period logic
  const [jobApplicationPeriod, setJobApplicationPeriod] = useState({
    startDate: '',
    endDate: ''
  });

  const handleJobApplicationPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobApplicationPeriod(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-white p-4 md:p-6 shadow-md break-words">
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
                className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
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
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 break-words"
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
                className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
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

        {/* Job Group */}
        <div className="mb-4">
          <label htmlFor="group_id" className="mb-2 block text-sm font-medium text-gray-700">Choose Job Group</label>
          <div className="relative">
            <select
              id="group_id"
              name="group_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 break-words"
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


        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">
            Key Roles & Responsibilities:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="min-w-full text-gray-900" aria-describedby="responsibilities-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Available Key Roles & Responsibilities:
                          </th>
                          <th scope="col" className="px-3 py-5 font-medium">
                            Actions
                          </th>
                          <th scope="col" className="px-3 py-5 font-medium">
                            Added Key Roles & Responsibilities:
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="w-full border-b py-3 text-sm last-of-type:border-none">
                          <td className="whitespace-normal py-3 pl-6 pr-3">
                            <div aria-live="polite" aria-atomic="true">
                              <ul className="list-disc pl-6 break-words">
                                {responsibilities.map((responsibility, index) => (
                                  <li
                                    key={index}
                                    className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer break-words ${clickedResponsibilities.includes(responsibility.responsibility)
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
                          <td className="whitespace-normal px-3 py-3 flex flex-col items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={handleAddAllResponsibilities}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Add All
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAllResponsibilities}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete All
                            </button>
                          </td>
                          <td className="whitespace-normal px-3 py-3">
                            <ul className="list-disc pl-6 break-words">
                              {clickedResponsibilities.map((responsibility, index) => (
                                <li key={index} className="flex items-center gap-2 break-words">
                                  <CheckIcon className="w-5 text-blue-600" />
                                  <span>{responsibility}</span>
                                  <input type="hidden" name="responsibilities" value={responsibility} />
                                  <PencilIcon
                                    className="w-5 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => editJobResponsibility(responsibility)}
                                  />
                                  <TrashIcon
                                    className="w-5 text-red-600 cursor-pointer hover:text-red-800"
                                    onClick={() => handleDeleteResponsibility(responsibility)}
                                  />
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
          <div className="mt-4">
            <label
              htmlFor="responsibilityinput"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Enter Key Roles & Responsibilities:
            </label>
            <div className="relative mt-2 rounded-md">
              <textarea
                id="responsibilityinput"
                name="responsibilityinput"
                placeholder="Enter Key Roles & Responsibilities:"
                value={responsibilityInputValue}
                className="peer block w-full min-h-[8rem] max-h-[16rem] rounded-md border border-gray-300 py-2 pl-3 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y"
                aria-describedby="responsibilities-error"
                onChange={handleResponsibilityChange}
              />
              <button
                type="button"
                onClick={handleResponsibilityBlur}
                className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>

          </div>
          <div id="requirements-error" aria-live="polite" aria-atomic="true">
            {state.errors?.requirements &&
              state.errors.requirements.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">
            Job Requirements and Qualifications:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="min-w-full text-gray-900" aria-describedby="requirements-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Available Requirements
                          </th>
                          <th scope="col" className="px-3 py-5 font-medium">
                            Actions
                          </th>
                          <th scope="col" className="px-3 py-5 font-medium">
                            Added Required Qualifications and Experience:
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="w-full border-b py-3 text-sm last-of-type:border-none">
                          <td className="whitespace-normal py-3 pl-6 pr-3">
                            <div aria-live="polite" aria-atomic="true">
                              <ul className="list-disc pl-6 break-words">
                                {requirements.map((requirement, index) => (
                                  <li
                                    key={index}
                                    className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer break-words ${clickedRequirements.includes(requirement.requirement)
                                      ? 'bg-blue-100 text-blue-600 pointer-events-none opacity-50'
                                      : 'bg-gray-50 hover:bg-blue-100 hover:text-blue-600'
                                      }`}
                                    onClick={() =>
                                      !clickedRequirements.includes(requirement.requirement) &&
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
                          <td className="whitespace-normal px-3 py-3 flex flex-col items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={handleAddAllRequirements}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Add All
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAllRequirements}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete All
                            </button>
                          </td>
                          <td className="whitespace-normal px-3 py-3">
                            <ul className="list-disc pl-6 break-words">
                              {clickedRequirements.map((requirement, index) => (
                                <li key={index} className="flex items-center gap-2 break-words">
                                  <CheckIcon className="w-5 text-blue-600" />
                                  <span>{requirement}</span>
                                  <input type="hidden" name="requirements" value={requirement} />
                                  <PencilIcon
                                    className="w-5 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => editJobRequirement(requirement)}
                                  />
                                  <TrashIcon
                                    className="w-5 text-red-600 cursor-pointer hover:text-red-800"
                                    onClick={() => handleDeleteRequirement(requirement)}
                                  />
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
          <div className="mt-4">
            <label
              htmlFor="requirement"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Enter Requirement
            </label>
            <div className="relative mt-2 rounded-md">
              <textarea
                id="requirement"
                name="requirement"
                placeholder="Enter Requirement"
                value={requirementInputValue}
                className="peer block w-full min-h-[8rem] max-h-[16rem] rounded-md border border-gray-300 py-2 pl-3 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y"
                aria-describedby="requirement-error"
                onChange={handleRequirementChange}
              />
              <button
                type="button"
                onClick={handleRequirementBlur}
                className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>


          </div>
          <div id="requirements-error" aria-live="polite" aria-atomic="true">
            {state.errors?.requirements &&
              state.errors.requirements.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Job Application Period */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <label htmlFor="startDate" className="text-xs font-medium text-gray-600">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={jobApplicationPeriod.startDate}
              onChange={handleJobApplicationPeriodChange}
              className="h-10 px-2 mt-1 block w-full border border-gray-300 rounded-md break-words"
              aria-describedby="startDate-error"
            />
          </div>
          <div id="startDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.startDate &&
              state.errors.startDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
          <div className="flex items-center">
            <label htmlFor="endDate" className="text-xs font-medium text-gray-600">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={jobApplicationPeriod.endDate}
              onChange={handleJobApplicationPeriodChange}
              className="h-10 px-2 mt-1 block w-full border border-gray-300 rounded-md break-words"
              aria-describedby="endDate-error"
            />
          </div>
          <div id="endDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.endDate &&
              state.errors.endDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>
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
