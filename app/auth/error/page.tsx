"use client";

export default function Error({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <div>Error {searchParams.error}</div>;
}
