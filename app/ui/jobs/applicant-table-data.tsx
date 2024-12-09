import Image from 'next/image';
import { ExporttoExcel } from '@/app/ui/jobs/buttons';
//import JobStatus from '@/app/ui/jobs/status';
//import { formatDateToLocal } from '@/app/lib/utils';
import { fetchApplicantInformation } from '@/app/lib/data';
import { CheckIcon } from '@heroicons/react/24/outline';
import styles from '@/app/ui/home.module.css';
import * as XLSX from 'xlsx';

export default async function ApplicantsTable() {
  const applicants = await fetchApplicantInformation();


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

          <ExporttoExcel applicants={applicants} />

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 break-words">
                  fullname
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  countryofresidence
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  email
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  positionid
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  app_educations
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  app_experiences
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  app_resumes
                </th>
                <th scope="col" className="px-3 py-5 font-medium break-words">
                  app_cover_letters
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3 break-words">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3 break-words">
                  <span className="sr-only">Application</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {applicants?.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-normal py-3 pl-6 pr-3 break-words">
                    <div className="flex items-center gap-3">
                      <p className="break-words">{applicant.fullname}</p>
                    </div>
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    {applicant.countryofresidence}
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    {applicant.phone}
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    {applicant.email}
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    {applicant.positionid}
                  </td>
                  <td className="px-3 py-3">
                    <ul className="space-y-2"> {/* Add space between education entries */}
                      {applicant.app_educations.map((education, index) => (
                        <li key={index} className="flex items-start space-x-2 p-2 bg-gray-100 rounded-lg shadow-sm">
                          <CheckIcon className="w-5 text-green-500" /> {/* Add a more prominent color */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {education.institution_name}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {education.is_highest_level}
                            </span>
                            <span className="text-sm text-gray-500">
                              {education.degree_name_id ? education.degree_name_id : 'Degree not specified'}
                            </span>
                            <span className="text-sm text-gray-400">
                              {new Date(education.start_date).toLocaleDateString()} -
                              {education.end_date ? new Date(education.end_date).toLocaleDateString() : 'Present'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="whitespace-normal px-3 py-3 break-words">
                    <ul className={styles.list}>
                      {applicant.app_experiences.map((experience, index) => (
                        <li key={index} className={styles.listItem}>
                          <CheckIcon className="w-5" />
                          <span className={styles.text}>{experience.company_name}</span>
                          <span className={styles.text}>{experience.job_title}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="whitespace-normal px-3 py-3 break-words">
                    <ul className={styles.list}>
                      {applicant.app_resumes.map((resume, index) => (
                        <li key={index} className={styles.listItem}>
                          <CheckIcon className="w-5" />
                          <span className={styles.text}>{resume.name}</span>
                          <span className={styles.text}>{resume.url}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="whitespace-normal px-3 py-3 break-words">
                    <ul className={styles.list}>
                      {applicant.app_cover_letters.map((coverletters, index) => (
                        <li key={index} className={styles.listItem}>
                          <CheckIcon className="w-5" />
                          <span className={styles.text}>{coverletters.name}</span>
                          <span className={styles.text}>{coverletters.url}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  {/* <td className="whitespace-normal px-3 py-3 break-words">
                    {formatDateToLocal(job.datecreated)}
                  </td>
                  <td className="whitespace-normal px-3 py-3 break-words">
                    <JobStatus status={job.status} />
                  </td>
                  <td className="whitespace-normal py-3 pl-6 pr-3 break-words">
                    <div className="flex justify-end gap-3">
                      <UpdateJob id={job.id} />
                      <DeleteJob id={job.id} />
                      <ApplyJob id={job.id} />
                    </div>
                  </td> */}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
