'use client';

import { TrashIcon } from "@heroicons/react/24/outline";

export default function ConfirmDelete ({ action, id }: { action: () => Promise<{message: string;} | undefined>; id: string; }) {
  return (
  <form 
  onSubmit={(e) => {
    if (!confirm(`Do you want to delete invoice ${id}?`)) e.preventDefault();
  }}
  action={action}>
    <button className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  </form>);
}