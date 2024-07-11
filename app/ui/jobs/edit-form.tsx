'use client';
import { useState, useEffect, useRef } from 'react';
import { JobForm, Station, JobGroup, Requirement, Responsibility } from '@/app/lib/definitions';
import {
  CogIcon,
  MapPinIcon,
  MoonIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateJob, deleteResponsibility, deleteQualification, revalidatePathOnJobGroupChange } from '@/app/lib/actions';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';



export default function EditJobForm({
  initialJob,
  stations,
  job_groups,
  job_id,
  requirements,
  responsibilities,
}: {
  initialJob: JobForm;
  stations: Station[];
  job_groups: JobGroup[];
  job_id: string;
  requirements: Requirement[];
  responsibilities: Responsibility[];

}) {

  const updateJobWithId = updateJob.bind(null, initialJob.id);


  //Editing job responsibility logics
  const [job, setJob] = useState<JobForm>(initialJob);

  const [responsibilityInputValue, setResponsibilityInputValue] = useState('');

  const [responsibilityEditingIndex, setResponsibilityEditingIndex] = useState<number | null>(null);

  const editJobResponsibility = (index: number) => {
    setResponsibilityInputValue(job.responsibility[index].responsibility);
    setResponsibilityEditingIndex(index);
  };

  const handleResponsibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResponsibilityInputValue(value);
  };

  const moveToResponsibilityRowData = useRef<HTMLTableDataCellElement>(null);
  const handleResponsibilityBlur = () => {

    if (responsibilityInputValue.trim() !== '' && responsibilityEditingIndex !== null) {
      const updatedResponsibilities = [...job.responsibility];
      updatedResponsibilities[responsibilityEditingIndex].responsibility = responsibilityInputValue;
      const updatedResponsibility = updatedResponsibilities[responsibilityEditingIndex]

      setJob((prevJob) => ({
        ...prevJob,
        responsibility: updatedResponsibilities,
      }));

      setResponsibilityEditingIndex(null);
    }

    if (moveToResponsibilityRowData.current) {
      moveToResponsibilityRowData.current.scrollIntoView({ behavior: 'smooth', });
      moveToResponsibilityRowData.current.focus();
    }
    setResponsibilityInputValue(''); // Clear input value after processing
  };

  const textareaRefResp = useRef<HTMLTextAreaElement>(null);

  const handleResponsibilityEditClick = (index: number) => {
    editJobResponsibility(index);
    if (textareaRefResp.current) {
      textareaRefResp.current.scrollIntoView({ behavior: 'smooth' });
      textareaRefResp.current.focus();
    }
  };

  const handleResponsibilityDeleteClick = async (id: string) => {
    await deleteResponsibility(id, job_id);
    window.location.reload();
  };


  // Creating new key roles and responsibilities logics
  const [responsibilityNewInputValue, setNewResponsibilityInputValue] = useState<string>('');
  const [clickedNewResponsibilities, setClickedNewResponsibilities] = useState<string[]>([]);

  const handleResponsibilityNewClick = (id: string) => {
    setClickedNewResponsibilities((prevClickedNewResponsibilities) => [...prevClickedNewResponsibilities, id]);
  };

  const editJobNewResponsibility = (edit_new_responsibility: string) => {
    setNewResponsibilityInputValue(edit_new_responsibility);
    setClickedNewResponsibilities((prevClickedNewResponsibilities) =>
      prevClickedNewResponsibilities.filter(responsibility => responsibility !== edit_new_responsibility)
    );
  };

  const handleNewResponsibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewResponsibilityInputValue(value);
  };

  const handleNewResponsibilityBlur = () => {
    if (responsibilityNewInputValue.trim() !== '') {
      setClickedNewResponsibilities((prevClickedResponsibilities) => [...prevClickedResponsibilities, responsibilityNewInputValue]);
    }
    setNewResponsibilityInputValue(''); // Clear input value after processing
  };

  const handleAddAllNewResponsibilities = () => {
    const availableResponsibilities = responsibilities
      .map(responsibility => responsibility.responsibility)
      .filter(responsibility => !clickedNewResponsibilities.includes(responsibility));
    setClickedNewResponsibilities(prevClickedResponsibilities => [...prevClickedResponsibilities, ...availableResponsibilities]);
  };

  const handleDeleteNewResponsibility = (delete_responsibility: string) => {
    setClickedNewResponsibilities((prevClickedResponsibilities) =>
      prevClickedResponsibilities.filter(responsibility => responsibility !== delete_responsibility)
    );
  };

  const handleDeleteAllNewResponsibilities = () => {
    setClickedNewResponsibilities([]);
  };


  // Editing job qualification logics
  const [qualificationInputValue, setQualificationInputValue] = useState('');
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

    if (qualificationInputValue.trim() !== '' && qualificationEditingIndex !== null) {
      const updatedQualifications = [...job.requirement];
      updatedQualifications[qualificationEditingIndex].requirement = qualificationInputValue;

      setJob((prevJob) => ({
        ...prevJob,
        requirement: updatedQualifications,
      }));

      setQualificationEditingIndex(null);
    }

    if (moveToQualificationRowData.current) {
      moveToQualificationRowData.current.scrollIntoView({ behavior: 'smooth' });
      moveToQualificationRowData.current.focus();
    }
    setQualificationInputValue(''); // Clear input value after processing
  };



  const moveToQualificationRowData = useRef<HTMLTableDataCellElement>(null);

  const textareaRefQualification = useRef<HTMLTextAreaElement>(null);

  const handleQualificationEditClick = (index: number) => {
    editJobQualification(index);
    if (textareaRefQualification.current) {
      textareaRefQualification.current.scrollIntoView({ behavior: 'smooth' });
      textareaRefQualification.current.focus();
    }
  };



  const handleQualificationDeleteClick = async (id: string) => {
    await deleteQualification(id, job_id);
    window.location.reload();
  };


  const handleDateInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur(); // Ensure the input loses focus to open the date picker
    inputElement.focus(); // Refocus to allow the date picker to open
  };


  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [jobGroupValue, setJobGroupValue] = useState('');

  const handleJobGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setJobGroupValue(value);
    handleJobGroup(jobGroupValue);
    revalidatePathOnJobGroupChange(job_id);
  };

  const handleJobGroup = (group_query_edit: string) => {
    const params = new URLSearchParams(searchParams);
    if (group_query_edit) {
      params.set('group_query_edit', group_query_edit);
      
    } else {
      params.delete('group_query_edit');
    }
    replace(`${pathname}?${params.toString()}`);
   
  };


  // Creating new requirement logics

  const [newRequirementInputValue, setNewRequirementInputValue] = useState<string>('');
  const [newClickedRequirements, setNewClickedRequirements] = useState<string[]>([]);

  const handleNewRequirementClick = (id: string) => {
    setNewClickedRequirements((prevNewClickedRequirements) => [...prevNewClickedRequirements, id]);
  };

  const editNewJobRequirement = (edit_new_requirement: string) => {
    setNewRequirementInputValue(edit_new_requirement);
    setNewClickedRequirements((prevNewClickedRequirements) =>
      prevNewClickedRequirements.filter(requirement => requirement !== edit_new_requirement)
    );
  };

  const handleNewRequirementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewRequirementInputValue(value);
  };

  const handleNewRequirementBlur = () => {
    if (newRequirementInputValue.trim() !== '') {
      setNewClickedRequirements((prevNewClickedRequirements) => [...prevNewClickedRequirements, newRequirementInputValue]);
    }
    setNewRequirementInputValue(''); // Clear input value after processing
  };

  const handleAddAllNewRequirements = () => {
    const availableNewRequirements = requirements
      .map(requirement => requirement.requirement)
      .filter(requirement => !newClickedRequirements.includes(requirement));
    setNewClickedRequirements(prevClickedNewRequirements => [...prevClickedNewRequirements, ...availableNewRequirements]);
  };

  const handleDeleteNewRequirement = (delete_new_requirement: string) => {
    setNewClickedRequirements((prevClickedRequirements) =>
      prevClickedRequirements.filter(requirement => requirement !== delete_new_requirement)
    );
  };

  const handleDeleteAllNewRequirements = () => {
    setNewClickedRequirements([]);
  };


  // Job Application period logic
  const [jobApplicationDateRange, setJobApplicationDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {

    if (job && job.startdate && job.enddate) {
      setJobApplicationDateRange({
        startDate: job.startdate,
        endDate: job.enddate
      });
      setJobGroupValue(job.job_group);
    } else {
      console.warn('Job or job dates are not properly defined:', job);
    }
  }, [job]);


  const handleJobApplicationDateRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debugging log
    setJobApplicationDateRange(prevState => ({
      ...prevState,
      [name]: value
    }));
  };






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
              defaultValue={jobGroupValue}
              onChange={handleJobGroupChange}
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
            Current  Key Roles & Responsibilities:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                  <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
                    <table className="hidden min-w-full text-gray-900 md:table" aria-describedby="responsibilities-error">
                      <thead className="rounded-lg text-left text-sm font-normal text-gray-900">
                        <tr className="p-2">
                          <th className="py-2 pl-4 pr-3">Current Key & Responsibility</th>
                          <th className="py-2 pr-3 text-center">Edit</th>
                          <th className="py-2 pr-3 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.responsibility.map((role, index) => (
                          <tr key={index} className="text-left text-xs md:text-sm text-gray-700">
                            <td className="py-2 pl-4 pr-3 max-w-[20rem] break-words" ref={moveToResponsibilityRowData}>
                              <div className="overflow-hidden overflow-ellipsis">{role.responsibility}</div>
                            </td>
                            <td className="py-2 pr-3 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  className="hover:bg-primary-700 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium"
                                  onClick={() => handleResponsibilityEditClick(index)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>

                            <td className="py-2 pr-3 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  className="bg-red-500 hover:bg-red-700 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium text-white"
                                  onClick={() => handleResponsibilityDeleteClick(role.id)}
                                >
                                  Delete
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
                  ref={textareaRefResp}
                  id="responsibility"
                  name="responsibility"
                  placeholder="Edit Current Key Role & Responsibility"
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
          <input type="hidden" name="responsibilitiesJsonString" value={JSON.stringify(job.responsibility)} />
        </div>




        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">
            New Key Roles & Responsibilities:
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
                            Ney Key Roles & Responsibilities:
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
                                    className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer break-words ${clickedNewResponsibilities.includes(responsibility.responsibility)
                                      ? 'bg-blue-100 text-blue-600 pointer-events-none opacity-50'
                                      : 'bg-gray-50 hover:bg-blue-100 hover:text-blue-600'
                                      }`}
                                    onClick={() =>
                                      !clickedNewResponsibilities.includes(responsibility.responsibility) &&
                                      handleResponsibilityNewClick(responsibility.responsibility)
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
                              onClick={handleAddAllNewResponsibilities}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Add All
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAllNewResponsibilities}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete All
                            </button>
                          </td>
                          <td className="whitespace-normal px-3 py-3">
                            <ul className="list-disc pl-6 break-words">
                              {clickedNewResponsibilities.map((responsibility, index) => (
                                <li key={index} className="flex items-center gap-2 break-words">
                                  <CheckIcon className="w-5 text-blue-600" />
                                  <span>{responsibility}</span>
                                  <input type="hidden" name="responsibilities" value={responsibility} />
                                  <PencilIcon
                                    className="w-5 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => editJobNewResponsibility(responsibility)}
                                  />
                                  <TrashIcon
                                    className="w-5 text-red-600 cursor-pointer hover:text-red-800"
                                    onClick={() => handleDeleteNewResponsibility(responsibility)}
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
              Enter New Key Role & Responsibility:
            </label>
            <div className="relative mt-2 rounded-md">
              <textarea
                id="responsibilityinput"
                name="responsibilityinput"
                placeholder="Enter Key Roles & Responsibilities:"
                value={responsibilityNewInputValue}
                className="peer block w-full min-h-[8rem] max-h-[16rem] rounded-md border border-gray-300 py-2 pl-3 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y"
                aria-describedby="responsibilities-error"
                onChange={handleNewResponsibilityChange}
              />
              <button
                type="button"
                onClick={handleNewResponsibilityBlur}
                className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>

          </div>
        </div>


        {/* Requirements */}
        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">
            Current Key Qualifications & Requirements:
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
                          <th className="py-2 pr-3 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.requirement.map((req, index) => (
                          <tr key={index} className="text-left text-xs md:text-sm text-gray-700" >
                            <td className="py-2 pl-4 pr-3 max-w-[20rem] break-words" ref={moveToQualificationRowData}>
                              <div className="overflow-hidden overflow-ellipsis">{req.requirement}</div>
                            </td>
                            <td className="py-2 pr-3 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  className="hover:bg-primary-700 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium"
                                  onClick={() => handleQualificationEditClick(index)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                            <td className="py-2 pr-3 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  className="bg-red-500 hover:bg-red-700 inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium text-white"
                                  onClick={() => handleQualificationDeleteClick(req.id)}
                                >
                                  Delete
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
                  ref={textareaRefQualification}
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
          <input type="hidden" name="requirementsJsonString" value={JSON.stringify(job.requirement)} />
        </div>



        <div className="mb-4">
          <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-700">
            New Key Qualifications and Experience::
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
                            New Key Qualifications and Experience:
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
                                    className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium cursor-pointer break-words ${newClickedRequirements.includes(requirement.requirement)
                                      ? 'bg-blue-100 text-blue-600 pointer-events-none opacity-50'
                                      : 'bg-gray-50 hover:bg-blue-100 hover:text-blue-600'
                                      }`}
                                    onClick={() =>
                                      !newClickedRequirements.includes(requirement.requirement) &&
                                      handleNewRequirementClick(requirement.requirement)
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
                              onClick={handleAddAllNewRequirements}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Add All
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAllNewRequirements}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete All
                            </button>
                          </td>
                          <td className="whitespace-normal px-3 py-3">
                            <ul className="list-disc pl-6 break-words">
                              {newClickedRequirements.map((requirement, index) => (
                                <li key={index} className="flex items-center gap-2 break-words">
                                  <CheckIcon className="w-5 text-blue-600" />
                                  <span>{requirement}</span>
                                  <input type="hidden" name="requirements" value={requirement} />
                                  <PencilIcon
                                    className="w-5 text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => editNewJobRequirement(requirement)}
                                  />
                                  <TrashIcon
                                    className="w-5 text-red-600 cursor-pointer hover:text-red-800"
                                    onClick={() => handleDeleteNewRequirement(requirement)}
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
              Enter New Qualification and Experience
            </label>
            <div className="relative mt-2 rounded-md">
              <textarea
                id="requirement"
                name="requirement"
                placeholder="Enter New Qualification and Experience"
                value={newRequirementInputValue}
                className="peer block w-full min-h-[8rem] max-h-[16rem] rounded-md border border-gray-300 py-2 pl-3 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y"
                aria-describedby="requirement-error"
                onChange={handleNewRequirementChange}
              />
              <button
                type="button"
                onClick={handleNewRequirementBlur}
                className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>

          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="application-period" className="block text-sm font-medium">
            Job Application Period
          </label>
          <div className="relative mt-2 space-y-4">
            <div className="relative">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="relative">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={jobApplicationDateRange.startDate}
                  onChange={handleJobApplicationDateRange}
                  onClick={handleDateInputClick} // Open date picker on click
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="relative mt-4">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="relative">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={jobApplicationDateRange.endDate}
                  onChange={handleJobApplicationDateRange}
                  onClick={handleDateInputClick} // Open date picker on click
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
