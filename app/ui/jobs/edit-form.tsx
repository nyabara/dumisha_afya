'use client';
import { useState, useEffect } from 'react';
import { JobForm, Station, JobGroup, Requirement, Responsibility } from '@/app/lib/definitions';
import {
  CogIcon,
  MapPinIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateJob } from '@/app/lib/actions';

export default function EditJobForm({
  initialJob,
  stations,
  job_groups
}: {
  initialJob: JobForm;
  stations: Station[];
  job_groups: JobGroup[];
}) {

  const updateJobWithId = updateJob.bind(null, initialJob.id);

  // Editing job responsibility logics
  const [job, setJob] = useState<JobForm>(initialJob);
  const [responsibilityInputValue, setResponsibilityInputValue] = useState('');
  const [clickedResponsibilities, setClickedResponsibilities] = useState<Responsibility[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const editJobResponsibility = (index: number) => {
    setResponsibilityInputValue(job.responsibility[index].responsibility);
    setEditingIndex(index);
  };

  const handleResponsibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResponsibilityInputValue(value);
  };

  const handleResponsibilityBlur = () => {

    if (responsibilityInputValue.trim() !== '' && editingIndex !== null) {
      const updatedResponsibilities = [...job.responsibility];
      updatedResponsibilities[editingIndex].responsibility = responsibilityInputValue;
      const updatedResponsibility = updatedResponsibilities[editingIndex]

      // setClickedResponsibilities((prevClickedResponsibilities) => [...prevClickedResponsibilities, updatedResponsibility]);


      setJob((prevJob) => ({
        ...prevJob,
        responsibility: updatedResponsibilities,
      }));

      setEditingIndex(null);
    }
    setResponsibilityInputValue(''); // Clear input value after processing
  };

  // Editing job qualification logics
  const [qualificationInputValue, setQualificationInputValue] = useState('');
  const [clickedQualifications, setClickedQualifications] = useState<string[]>([]);
  const [qualificationEditingIndex, setQualificationEditingIndex] = useState<number | null>(null);

  const editJobQualification = (index: number) => {
    setQualificationInputValue(job.requirement[index].requirement);
    setQualificationEditingIndex(index);
  };

  const handleQualificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQualificationInputValue(value);
  };

  const handleQualificationBlur = () => {
    // if (qualificationInputValue.trim() !== '') {
    //   setClickedQualifications((prevClickedQualifications) => [...prevClickedQualifications, qualificationInputValue]);
    // }
    if (qualificationInputValue.trim() !== '' && qualificationEditingIndex !== null) {
      const updatedQualifications = [...job.requirement];
      updatedQualifications[qualificationEditingIndex].requirement = qualificationInputValue;

      setJob((prevJob) => ({
        ...prevJob,
        requirement: updatedQualifications,
      }));

      setEditingIndex(null);
    }
    setQualificationInputValue(''); // Clear input value after processing
  };

  // Job Application period logic
  const [jobApplicationPeriod, setJobApplicationPeriod] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Initialize jobApplicationPeriod based on job when the component mounts or job changes
    if (job) {
      setJobApplicationPeriod({
        startDate: job.startDate || '',
        endDate: job.endDate || ''
      });
    }
  }, [job]);

  const handleJobApplicationPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debugging log
    setJobApplicationPeriod(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log('jobApplicationPeriod updated:', jobApplicationPeriod); // Debugging log
  }, [jobApplicationPeriod]);

  return (
    <form action={updateJobWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Job Title */}
        <div className="mb-4">
          <label htmlFor="position" className="mb-2 block text-sm font-medium">
            Job Position
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="position"
                name="position"
                type="text"
                defaultValue={job.position}
                placeholder="Enter Position"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CogIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Job Location */}
        <div className="mb-4">
          <label htmlFor="station" className="mb-2 block text-sm font-medium">
            Choose station Place
          </label>
          <div className="relative">
            <select
              id="station"
              name="station"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select Place of Attachment
              </option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.station}
                </option>
              ))}
            </select>
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
                defaultValue={job.period}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="period-error"
              />
              <MoonIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
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
              //onChange={(e) => handleJobGroup(e.target.value)}
              aria-describedby="group_id-error"
            >
              <option value="" disabled>Select Job Group</option>
              {job_groups.map((jobgroup) => (
                <option key={jobgroup.id} value={jobgroup.id}>{jobgroup.job_group}</option>
              ))}
            </select>
          </div>
        </div>




        {/* Responsibilities */}


        <div className="mb-4">
          <label htmlFor="responsibilities" className="mb-2 block text-sm font-medium text-gray-700">
            Key Roles & Responsibilities:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="hidden min-w-full text-gray-900 md:table" aria-describedby="responsibilities-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-900">
                        <tr className="p-2">
                          <th className="py-2 pl-4 pr-3">Responsibility</th>
                          <th className="py-2 pr-3 text-center">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.responsibility.map((role, index) => (
                          <tr key={index} className="text-left text-xs md:text-sm text-gray-700">
                            <td className="py-2 pl-4 pr-3 max-w-[20rem] break-words">
                              <div className="overflow-hidden overflow-ellipsis">{role.responsibility}</div>
                            </td>
                            <td className="py-2 pr-3 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  className="hover:bg-primary-700 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium"
                                  onClick={() => editJobResponsibility(index)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* <div className="relative mt-2 rounded-md">
                <textarea
                  id="responsibility"
                  name="responsibility"
                  placeholder="Enter Key Roles & Responsibilities"
                  value={responsibilityInputValue}
                  className="peer block w-full h-24 min-h-[6rem] max-h-[12rem] rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y break-words"
                  aria-describedby="responsibilities-error"
                  onChange={handleResponsibilityChange}
                  onBlur={handleResponsibilityBlur}
                />
              </div> */}

              <div className="relative mt-2 rounded-md">
                <textarea
                  id="responsibility"
                  name="responsibility"
                  placeholder="Edit Key Roles & Responsibilities"
                  value={responsibilityInputValue}
                  className="peer block w-full h-24 min-h-[6rem] max-h-[12rem] rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y break-words"
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
          </div>
        </div>
        <div className="relative hidden">
          <input type="hidden" name="responsibilities" value={JSON.stringify(job.responsibility)} />
        </div>


        {/* Requirements */}
        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">
            Key Qualifications & Requirements:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="hidden min-w-full text-gray-900 md:table break-words" aria-describedby="requirements-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-900">
                        <tr className="p-2">
                          <th className="py-2 pl-4 pr-3">Requirement</th>
                          <th className="py-2 pr-3 text-center">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.requirement.map((req, index) => (
                          <tr key={index} className="text-left text-xs md:text-sm text-gray-700">
                            <td className="py-2 pl-4 pr-3 max-w-[20rem] break-words">
                              <div className="overflow-hidden overflow-ellipsis">{req.requirement}</div>
                            </td>
                            <td className="py-2 pr-3 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  className="hover:bg-primary-700 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium"
                                  onClick={() => editJobQualification(index)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="relative mt-2 rounded-md">
                <textarea
                  id="requirement"
                  name="requirement"
                  placeholder="Required Qualifications and Experience"
                  value={qualificationInputValue}
                  className="peer block w-full h-24 min-h-[6rem] max-h-[12rem] rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y break-words"
                  aria-describedby="requirements-error"
                  onChange={handleQualificationChange}
                />
                <button
                  type="button"
                  onClick={handleQualificationBlur}
                  className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden">
          <input type="hidden" name="requirements" value={JSON.stringify(job.requirement)} />
        </div>

        {/* Job Application Period */}
        <div className="mb-4">
          <label htmlFor="application-period" className="mb-2 block text-sm font-medium">
            Job Application Period
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={jobApplicationPeriod.startDate}
                onChange={handleJobApplicationPeriodChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="relative mt-4">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={jobApplicationPeriod.endDate}
                onChange={handleJobApplicationPeriodChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            className="mt-4 inline-block rounded-md border border-gray-200 bg-primary-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Save
          </Button>
          <Link
            href="/dashboard/jobs"
            className="mt-4 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
