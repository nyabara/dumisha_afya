"use client";

import React from 'react';
import { PencilIcon, PlusIcon, TrashIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteJob } from '@/app/lib/actions';

import * as Dialog from '@radix-ui/react-dialog';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import {
  InformationCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon, } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus, } from 'react-dom';
import { createRequirement } from '@/app/lib/actions';
import { RequirementType } from '@/app/lib/definitions';


export function CreateJob() {
  return (
    <Link
      href="/dashboard/jobs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Job</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
// /dashboard/jobs/create

export function UpdateJob({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/jobs/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UpdateRequirement({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/jobs/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function AddRequire({ id,requirementypes }: { id: string; requirementypes:RequirementType[]; }) {

  const initialState = { message:"", errors: {} };
  const dispatch = createRequirement.bind(null)

  return (<>
  <Dialog.Root>
      <Dialog.Trigger asChild>
        <PlusIcon className="w-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}>Add Requirement</Dialog.Title>
          <Dialog.Description className={styles.DialogDescription}>
            {/* <></>Add requirements to this job. Click close when you're done. */}
            Add requirements to this job. Click close when you&apos;re done.
          </Dialog.Description>
          <form action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                Please add requirement to continue.
              </h1>
              <div className="w-full">
              <div className="hidden">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="position_id"
                  >
                    Job id
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="position_id"
                      type="string"
                      name="position_id"
                      placeholder=""
                      defaultValue={id}
                      required
                    />
                    <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="requirement"
                  >
                    Requirement
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="requirement"
                      type="string"
                      name="requirement"
                      placeholder="Enter job requirement"
                      required
                    />
                    <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                  <div id="period-error" aria-live="polite" aria-atomic="true">
                </div>
                </div>

                <div className="mt-4">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="rqvtype"
                  >
                    Choose requirement value type
                  </label>
                  <div className="relative">
                    <select
                      id="rqvtype"
                      name="rqvtype"
                      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      defaultValue=""
                      aria-describedby="rqvtype-error">
                      <option value="" disabled>
                        Select Type
                      </option>
                      {requirementypes.map((requirementype) => (
                        <option key={requirementype.id} value={requirementype.id}>
                          {requirementype.requirement_type}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button type="submit">Create Requirement</Button>
              </div>
          </form>
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <Dialog.Close asChild>
              <button className={styles.Button}>Close</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>
    
  );
}

export function DeleteJob({ id }: { id: string }) {
  const deleteJobWithId = deleteJob.bind(null, id);
  return (
    <form action={deleteJobWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}


function AddButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Add <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
