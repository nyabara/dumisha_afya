'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { lusitana } from '@/app/ui/fonts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { createApplication } from '@/app/lib/actions';
import {
  LockClosedIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,

} from '@heroicons/react/24/outline';
import {

  JobForm,
  Gender,
  Country,
  Languages,
  EducationLevel,
  DegreeName,
  ApplicationOrigin,
  Experience,
  ApplicantEducation,
  Resumes,
  CoverLetters
} from '@/app/lib/definitions';

import clsx from 'clsx';


const iconMap = {
  closed: LockClosedIcon,
  customers: UserGroupIcon,
  open: ClockIcon,
  jobs: InboxIcon,
};

export default function Form({
  initialJob,
  gender,
  countries,
  languages,
  educationLevels,
  applicationOrigins,
  degreeName,
}:
  {
    initialJob: JobForm;
    gender: Gender[];
    countries: Country[];
    languages: Languages[];
    educationLevels: EducationLevel[];
    applicationOrigins: ApplicationOrigin[];
    degreeName: DegreeName[];

  }) {

  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createApplication, initialState);

  {/* EDUCATION LOGIC START */ }
  const [educations, setEducations] = useState<ApplicantEducation[]>([
    {
      id: Date.now().toString(),
      applicant_id: '',
      education_level_id: '',
      degree_name_id: '',
      subject_id: '',
      start_date: '',
      end_date: '',
      institution_name: '',
      is_highest_level: false,
    },

  ]);

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      {
        id: Date.now().toString(),
        applicant_id: '',
        education_level_id: '',
        degree_name_id: '',
        subject_id: '',
        start_date: '',
        end_date: '',
        institution_name: '',
        is_highest_level: false,
      },
    ]);
  };


  const handleRemoveEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const handleEducationChange = (id: string, field: keyof ApplicantEducation, value: string | boolean) => {
    setEducations(
      educations.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };
  {/* EDUCATION LOGIC END */ }


  {/* EXPERIENCE LOGIC START */ }
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: Date.now().toString(),
      applicant_id: '',
      job_title: '',
      company_name: '',
      start_date: '',
      end_date: '',
      description: '',
      current_workplace: false,

    },
  ]);

  const handleAddExperience = () => {
    setExperiences([

      ...experiences,
      {
        id: Date.now().toString(),
        applicant_id: '',
        job_title: '',
        company_name: '',
        start_date: '',
        end_date: '',
        description: '',
        current_workplace: false,
      },
    ]);
  };



  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleChange = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(
      experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };
  {/* EXPERIENCE LOGIC END */ }

  {/* RESUME LOGIC START */ }
  const [resumes, setResumes] = useState<Resumes[]>([]);
  const [attachmentName, setAttachmentName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleAttachmentNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAttachmentName(e.target.value);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {

      setResumeFile(e.target.files[0]);

    }
  };

  const handleAddResume = async () => {
    if (attachmentName && resumeFile) {

      const formData = new FormData();

      formData.append("file", resumeFile);


      try {

        const response = await fetch('/api/uploadResume', {

          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const result = await response.json();


        if (result.url) {



          const newResume: Resumes = {
            id: new Date().toISOString(),
            // Use a unique identifier
            name: attachmentName,
            url: result.url, // You might need to handle file upload differently based on your backend
            applicant_id: "",
          };
          setResumes([...resumes, newResume]);
          setAttachmentName('');
          setResumeFile(null);
          console.log(result.url);

        } else {

          console.error(result.error);

        }


      } catch (error) {

        console.error('Error uploading file:', error);
        // Handle the error appropriately here
      }

    } else {
      alert('Please fill in all fields');
    }
  };
  {/* RESUME LOGIC END */ }


  {/* COVER LETTER LOGIC START */ }
  const [coverLetterName, setCoverLetterName] = useState('');
  const [coverletters, setCoverLetters] = useState<CoverLetters[]>([]);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const handleCoverLetterNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoverLetterName(e.target.value);
  };


  const handleCoverLetterFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverLetterFile(e.target.files[0]);


    }
  };

  const handleAddCoverLetter = async () => {
    if (coverLetterName && coverLetterFile) {

      const formData = new FormData();

      formData.append("file", coverLetterFile);


      try {


        const response = await fetch('/api/uploadCoverLetter', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const result = await response.json();
        if (result.url) {
          const newCoverLetter: CoverLetters = {
            id: new Date().toISOString(), // Use a unique identifier
            name: coverLetterName,
            url: result.url, // You might need to handle file upload differently based on your backend
            applicant_id: "",
          };
          setCoverLetters([...coverletters, newCoverLetter]);
          setCoverLetterName('');
          setCoverLetterFile(null);
          console.log("CoverLetterUrl:" + result.url);
        } else {
          console.error('Upload failed:', result.error);
        }

      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle the error appropriately here
      }


    } else {
      alert('Please fill in all fields');
    }
  };

  // const [showModal, setShowModal] = useState(false);
  // const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  // useEffect(() => {
  //   if (state?.message) {
  //     setErrorMessages(Array.isArray(state.message) ? state.message : [state.message]);
  //     setShowModal(true);
  //   }
  // }, [state?.message]);

  const [showModal, setShowModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  useEffect(() => {

    if (state?.message) {
      // Preserve and update error messages
      setErrorMessages(Array.isArray(state.message) ? state.message : [state.message]);
      // Show the modal
      setShowModal(true);


    }
  }, [state?.message]);

  const handleCloseModal = () => {
    // Hide the modal
    setShowModal(false);
    setErrorMessages(null);
    if (state) {
      
      state.message = ''; // or `null` if your type allows it
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    //event.preventDefault();
    // Assuming the state.message will have errors if submission fails
    if (state?.message) {
      setErrorMessages(Array.isArray(state.message) ? state.message : [state.message]);
      setShowModal(true);
    } else {
      // Handle successful form submission here if needed
      setShowModal(false);
    }
  };




  return (

    <form action={dispatch} className="p-6">

      <h2 className={`${lusitana.className} mb-4 text-2xl md:text-3xl text-center`}>
        I am applying for a job offer
      </h2>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <Card title="Offer title" value={initialJob.position} type="open" />

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Required fields <span className="text-red-500">*</span></h3>
        </div>

        <div className="relative hidden">
          <input type="hidden" name="positionid" value={initialJob.id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CANDIDATE INFORMATION Column */}

          <div className="rounded-lg bg-gray-50 p-6 shadow-md">
            <p className={`${lusitana.className} text-center text-xl font-semibold mb-4`}>
              Candidate Information
            </p>

            <div className="space-y-8">
              <div className="rounded-lg bg-gray-50 p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Identify </h2>
                <div className="mb-6 p-4 border rounded bg-white shadow-sm">

                  {/* GENERAL DETAILS --- START */}
                  <div className="mb-4">
                    <label htmlFor="genderid" className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span></label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <select
                          id="genderid"
                          name="genderid"
                          className="peer block w-full cursor-pointer rounded-md border border-gray-300 
                      py-2 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 break-words"
                          defaultValue=""
                          aria-describedby="genderid-error"
                        >
                          <option value="" disabled>Please select a value</option>
                          {gender.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                              {gender.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div id="genderid-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.genderid &&
                        state.errors.genderid.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>
                  </div>


                  <div className="mb-4">
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                      Name (as it appears on your ID)
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="text"
                          name="fullname"
                          id="fullname"
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 
                        text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                          aria-describedby="fullname-error"
                        />
                      </div>
                    </div>

                    <div id="fullname-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.fullname &&
                        state.errors.fullname.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>
                  </div>


                  <div className="mb-4">
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                      First name(s) (as indicated on your identity document and in the same order)
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="text"
                          name="firstname"
                          id="firstname"
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm 
                        placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                          aria-describedby="firstname-error"
                        />
                      </div>
                    </div>
                    <div id="firstname-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.firstname &&
                        state.errors.firstname.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>
                  </div>



                  <div className="mb-4">
                    <label htmlFor="permanentaddress" className="block text-sm font-medium text-gray-700">
                      Permanent address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="text"
                          name="permanentaddress"
                          id="permanentaddress"
                          aria-describedby="permanentaddress-error"
                          className="peer block w-full rounded-md border border-gray-300 py-4 pl-3 text-sm 
                          placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"

                        />
                      </div>

                    </div>

                    <div id="permanentaddress-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.permanentaddress &&
                        state.errors.permanentaddress.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                    {/* <p className="text-xs text-gray-500 mt-1">0/100 characters</p> */}
                  </div>



                  <div className="mb-4">
                    <label htmlFor="postalcode" className="block text-sm font-medium text-gray-700">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="text"
                          name="postalcode"
                          id="postalcode"
                          aria-describedby="postalcode-error"
                          className="peer block w-full rounded-md border border-gray-300 py-2 
                          pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"

                        />
                      </div>

                      <div id="postalcode-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.postalcode &&
                          state.errors.postalcode.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </div>


                  <div className="mb-4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          aria-describedby="city-error"
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 
                        text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"

                        />
                      </div>
                    </div>
                    <div id="city-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.city &&
                        state.errors.city.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                  </div>

                  <div className="mb-4">
                    <label htmlFor="countryofresidence" className="block text-sm font-medium text-gray-700">
                      Country of residence <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <select
                          id="countryofresidence"
                          name="countryofresidence"
                          aria-describedby="countryofresidence-error"
                          className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 break-words"
                          defaultValue=""
                        >
                          <option value="" disabled>Please select value </option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div id="countryofresidence-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.countryofresidence &&
                        state.errors.countryofresidence.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          aria-describedby="email-error"
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"

                        />
                      </div>
                    </div>

                    <div id="email-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.email &&
                        state.errors.email.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                          aria-describedby="phone-error"
                        />

                      </div>
                    </div>

                    <div id="phone-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.phone &&
                        state.errors.phone.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                  </div>

                </div>
                {/* GENERAL DETAILS --- END */}

                {/* LANGUAGE DETAILS --- START */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
                <div className="mb-6 p-4 border rounded bg-white shadow-sm">

                  <div className="mb-6">
                    <label htmlFor="languageid1" className="block text-sm font-medium text-gray-700 mb-1">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <select
                          id="languageid1"
                          name="languageid1"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                          defaultValue=""
                          aria-describedby="languageid1-error"
                        >
                          <option value="" disabled>Please select a value </option>
                          {languages.map((language) => (
                            <option key={language.id} value={language.id}>
                              {language.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div id="languageid1-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.languageid1 &&
                        state.errors.languageid1.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                  </div>

                  <div className="mb-6">
                    <label htmlFor="language1level" className="block text-sm font-medium text-gray-700 mb-1">
                      Level <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="language1level"
                      name="language1level"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Please select a value</option>
                      {/* Add level options here */}
                    </select>
                  </div>

                </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Languages (2)</h3>
                  <div className="mb-6 p-4 border rounded bg-white shadow-sm">

                  <div className="mb-6">
                    <label htmlFor="languageid2" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <select
                          id="languageid2"
                          name="languageid2"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                          defaultValue=""
                          aria-describedby="languageid2-error"
                        >
                          <option value="" disabled>Please select a value</option>
                          {languages.map((language) => (
                            <option key={language.id} value={language.id}>
                              {language.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div id="languageid2-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.languageid2 &&
                        state.errors.languageid2.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>

                  </div>

                  <div className="mb-6">
                    <label htmlFor="language2level" className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      id="language2level"
                      name="language2level"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Please select a value</option>
                      {/* Add level options here */}
                    </select>
                  </div>

                </div>
                {/* LANGUAGE DETAILS --- END */}



                {/* EXPERIENCE DETAILS --- START */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Experience</h3>
                {experiences.map((experience, index) => (
                  <div key={experience.id} className="mb-6 p-4 border rounded bg-white shadow-sm">
                    <h4 className="font-bold text-gray-900">Experience {index + 1}</h4>

                    <div className="relative mt-2 rounded-md">
                      <div className="relative">

                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(experience.id)}
                          className="text-red-500 text-sm mb-2"
                        >
                          Remove
                        </button>

                        <div className="mb-4">
                          <label
                            htmlFor={`job_title_${experience.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Job Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`job_title_${experience.id}`}
                            value={experience.job_title}
                            onChange={(e) =>
                              handleChange(experience.id, 'job_title', e.target.value)
                            }
                            className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor={`company_name_${experience.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`company_name_${experience.id}`}
                            value={experience.company_name}
                            onChange={(e) =>
                              handleChange(experience.id, 'company_name', e.target.value)
                            }
                            className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Is this your current workplace?
                          </label>
                          <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={experience.current_workplace}
                                onChange={(e) =>
                                  handleChange(experience.id, 'current_workplace', e.target.checked)
                                }
                                className={clsx(
                                  "form-checkbox h-5 w-5 text-blue-600",
                                  experience.current_workplace ? "checked" : ""
                                )}
                              />
                              <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={!experience.current_workplace}
                                onChange={(e) =>
                                  handleChange(experience.id, 'current_workplace', !e.target.checked)
                                }
                                className={clsx(
                                  "form-checkbox h-5 w-5 text-blue-600",
                                  !experience.current_workplace ? "checked" : ""
                                )}
                              />
                              <span className="ml-2">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="mb-4">
                            <label
                              htmlFor={`start_date_${experience.id}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                              selected={experience.start_date ? new Date(experience.start_date) : null}
                              onChange={(date) =>
                                handleChange(experience.id, 'start_date', date ? date.toISOString().split('T')[0] : '')
                              }
                              dateFormat="yyyy-MM-dd"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 border-2 border-blue-300"
                            />
                          </div>

                          {!experience.current_workplace && (
                            <div className="mb-4">
                              <label
                                htmlFor={`end_date_${experience.id}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                End Date <span className="text-red-500">*</span>
                              </label>
                              <DatePicker
                                selected={experience.end_date ? new Date(experience.end_date) : null}
                                onChange={(date) =>
                                  handleChange(experience.id, 'end_date', date ? date.toISOString().split('T')[0] : '')
                                }
                                dateFormat="yyyy-MM-dd"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 border-2 border-blue-300"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor={`description_${experience.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Achievements
                          </label>
                          <textarea
                            id={`description_${experience.id}`}
                            value={experience.description}
                            onChange={(e) =>
                              handleChange(experience.id, 'description', e.target.value)
                            }
                            className="peer block w-full h-24 min-h-[6rem] max-h-[12rem] rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-y break-words"
                          />
                        </div>
                      </div>

                      <div id="experience-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.experience &&
                          state.errors.experience.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mb-4">

                  <Button
                    type="button"
                    onClick={handleAddExperience}
                    className="bg-blue-600 text-white hover:bg-blue-700"                  >
                    Add Experience
                  </Button>

                </div>
                {/* EXPERIENCE DETAILS --- END */}
                <div className="relative hidden">
                  <input type="hidden" name="experience" value={JSON.stringify(experiences)} aria-describedby="experience-error" />
                </div>
              </div>

            </div>

          </div>

          {/* APPLICATION INFORMATION Column */}
          <div className="rounded-lg bg-gray-50 p-6 shadow-md">
            <p className={`${lusitana.className} text-center text-xl font-semibold mb-4`}>
              Application Information
            </p>
            <div className="space-y-8">
              <div className="rounded-lg bg-gray-50 p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Origin of the application</h2>

                <div className="mb-6 p-4 border rounded bg-white shadow-sm">
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <div className="mb-4">
                        <label htmlFor="applicationoriginid" className="block text-sm font-medium text-gray-700">How did you come to apply?<span className="text-red-500">*</span></label>
                        <select
                          id="applicationoriginid"
                          name="applicationoriginid"
                          className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 break-words"
                          defaultValue=""
                          aria-describedby="applicationorigin-error"
                        >
                          <option value="" disabled>Please select a value</option>
                          {applicationOrigins.map((applicationOrigin) => (
                            <option key={applicationOrigin.id} value={applicationOrigin.id}>
                              {applicationOrigin.source}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div id="applicationorigin-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.applicationoriginid &&
                        state.errors.applicationoriginid.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        ))}
                    </div>



                  </div>

                </div>

                {/* EDUCATION DETAILS --- START */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>

                {educations.map((education, index) => (
                  <div key={education.id} className="mb-6 p-4 border rounded bg-white shadow-sm">
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <h4 className="font-bold text-gray-900">Education {index + 1}</h4>

                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(education.id)}
                          className="text-red-500 text-sm mb-2"
                        >
                          Remove
                        </button>

                        <div className="mb-4">
                          <label
                            htmlFor={`education_level_id_${education.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Level of Education <span className="text-red-500">*</span>
                          </label>
                          <select
                            id={`education_level_id_${education.id}`}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                            value={education.education_level_id}
                            onChange={(e) =>
                              handleEducationChange(education.id, 'education_level_id', e.target.value)
                            }
                          >
                            <option value="" disabled>Please select a value</option>
                            {educationLevels.map((educationLevel) => (
                              <option key={educationLevel.id} value={educationLevel.id}>
                                {educationLevel.level}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor={`degree_name_id_${education.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <select
                            id={`degree_name_id_${education.id}`}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                            value={education.degree_name_id}
                            onChange={(e) =>
                              handleEducationChange(education.id, 'degree_name_id', e.target.value)
                            }
                          >
                            <option value="" disabled>Please select a value</option>
                            {degreeName.map((degree) => (
                              <option key={degree.id} value={degree.id}>
                                {degree.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor={`institution_name_${education.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Institution Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`institution_name_${education.id}`}
                            value={education.institution_name}
                            onChange={(e) =>
                              handleEducationChange(education.id, 'institution_name', e.target.value)
                            }
                            className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor={`end_date_${education.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Graduation Date<span className="text-red-500">*</span>
                          </label>
                          <DatePicker
                            selected={education.end_date ? new Date(education.end_date) : null}
                            onChange={(date) =>
                              handleEducationChange(education.id, 'end_date', date ? date.toISOString().split('T')[0] : '')
                            }
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}  // Disables future dates
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 border-2 border-blue-300"
                          />
                        </div>

                        {/* Highest Level of Education Question */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Is this your highest level of education?
                          </label>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`highest_level_yes_${education.id}`}
                              name={`highest_level_${education.id}`}
                              value="yes"
                              checked={education.is_highest_level === true}
                              onChange={() =>
                                handleEducationChange(education.id, 'is_highest_level', true)
                              }
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor={`highest_level_yes_${education.id}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Yes
                            </label>
                            <input
                              type="radio"
                              id={`highest_level_no_${education.id}`}
                              name={`highest_level_${education.id}`}
                              value="no"
                              checked={education.is_highest_level === false}
                              onChange={() =>
                                handleEducationChange(education.id, 'is_highest_level', false)
                              }
                              className="ml-4 form-radio h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor={`highest_level_no_${education.id}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              No
                            </label>
                          </div>
                        </div>

                      </div>

                      <div id="education-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.education &&
                          state.errors.education.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                          ))}
                      </div>

                    </div>
                  </div>
                ))}


                <div className="mb-4">

                  <Button
                    type="button"
                    onClick={handleAddEducation}
                    className="bg-blue-600 text-white hover:bg-blue-700"                  >
                    Add Education
                  </Button>

                </div>
                {/* EDUCATION DETAILS --- END */}

                <div className="relative hidden">
                  <input type="hidden" name="education" value={JSON.stringify(educations)} aria-describedby="education" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">My Attachments</h3>

              <div className="mb-6 p-4 border rounded bg-white shadow-sm">
                <div className="relative mt-2 rounded-md">
                  <div className="relative">

                    <p className="text-sm text-gray-500 mb-4 italic">
                      Please upload your resume(s) here
                    </p>

                    <div className="mb-4 p-4 border border-gray-300 rounded-md shadow-md bg-white">
                      <div className="mb-4">
                        <label htmlFor="attachmentName" className="block text-sm font-medium text-gray-700">
                          Attachment Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="attachmentName"
                          id="attachmentName"
                          value={attachmentName}
                          onChange={handleAttachmentNameChange}
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                          File Upload <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="fileUpload"
                          id="fileUpload"
                          onChange={handleFileChange}
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                        />
                      </div>


                      <Button
                        type="button"
                        onClick={handleAddResume}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700">Added Resumes</h2>
                      <ul>
                        {resumes.map((resume) => (
                          <li key={resume.id} className="mb-2">
                            {/* <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          {resume.name}
                        </a> */}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  <div id="resume-error" aria-live="polite" aria-atomic="true">
                    {state?.errors?.resume &&
                      state.errors.resume.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                      ))}
                  </div>
                </div>

              </div>

              <div className="relative hidden">
                <input type="hidden" name="resume" value={JSON.stringify(resumes)} aria-describedby="resume-error" />
              </div>


              <div className="mb-6 p-4 border rounded bg-white shadow-sm">

                <div className="relative mt-2 rounded-md">
                  <div className="relative">

                    <p className="text-sm text-gray-500 mb-4 italic">
                      Please upload your Cover Letter(s) here
                    </p>

                    <div className="mb-4 p-4 border border-gray-300 rounded-md shadow-md bg-white">

                      <div className="mb-4">
                        <label htmlFor="attachmentName" className="block text-sm font-medium text-gray-700">
                          Attachment Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="attachmentName"
                          id="attachmentName"
                          onChange={handleCoverLetterNameChange}
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                          File Upload <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="fileUpload"
                          id="fileUpload"
                          onChange={handleCoverLetterFileChange}
                          className="peer block w-full rounded-md border border-gray-300 py-2 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 break-words"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddCoverLetter}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700">Added Cover Letters</h2>
                      <ul>
                        {coverletters.map((coverletter) => (
                          <li key={coverletter.id} className="mb-2">
                            {/* <a href={coverletter.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          {coverletter.name}
                        </a> */}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  <div id="coverletter-error" aria-live="polite" aria-atomic="true">
                    {state?.errors?.coverletter &&
                      state.errors.coverletter.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                      ))}
                  </div>
                </div>


              </div>
              <div className="relative hidden">
                <input type="hidden" name="coverletter" value={JSON.stringify(coverletters)} aria-describedby="coverletter-error" />
              </div>

            </div>

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
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>Submit</Button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
            <div className="mt-4">
              {errorMessages?.map((error, index) => (
                <p className="mt-2 text-sm text-red-500" key={index}>{error}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



    </form>

  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'jobs' | 'customers' | 'open' | 'closed';
}) {
  const Icon = iconMap[type];

  return (


    // <div className="flex items-center space-x-3">
    //   <div className="flex-shrink-0">
    //     {Icon ? <Icon className="h-6 w-6 text-gray-500" /> : null}
    //     <h3 className="text-sm font-medium text-gray-900">{title}</h3>
    //   </div>
    //   <p className={`${lusitana.className} mt-1 text-sm text-gray-500`}>
    //     {value}
    //   </p>
    // </div>
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-gray-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className="mt-1 text-sm text-gray-500">{value}</div>
      </div>
    </div>
  );
}


