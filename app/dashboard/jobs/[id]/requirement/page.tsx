import Form from '@/app/ui/jobs/edit-form';
import AddRequirement from '@/app/ui/jobs/requirement-dialog';
import { fetchJobById,fetchLocations } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [job, locations] = await Promise.all([
        fetchJobById(id),
        fetchLocations(),
      ]);
      if (!job) {
        notFound();
      }
      console.log("jobStatus1",job.status);
      console.log("jobId",job.id);
  return (
    
    <main>
      <AddRequirement/>

    </main>
  );
}