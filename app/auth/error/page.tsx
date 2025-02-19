"use server";

interface ErrorPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Error({
  searchParams
}: ErrorPageProps) {
  const params = await searchParams;
  const errorMessage = params.error;
  return <div>Error {errorMessage}</div>;
}
