// app/api/uploadCoverLetter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    // Extract FormData from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {

      return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });

    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Define the upload directory
    const uploadDir = path.join(process.cwd(), 'public/assets/resumes');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file to the server
    await fs.writeFile(path.join(uploadDir, file.name), buffer);

    // Optionally, revalidate the path
    revalidatePath('/');

    // Return the URL of the uploaded file
    const fileUrl = `/assets/resumes/${file.name}`;
    return new NextResponse(JSON.stringify({ url: fileUrl }), { status: 200 });
  } catch (error) {
    console.error('File upload error:', error);
    return new NextResponse(JSON.stringify({ error: 'File upload error' }), { status: 500 });
  }
}
