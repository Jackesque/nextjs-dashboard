'use server';

import { z as zod } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = zod.object({
  id: zod.string(),
  customerId: zod.string(),
  amount: zod.coerce.number(),
  status: zod.enum(['pending', 'paid']),
  date: zod.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const invoiceData = {
    customerId, 
    amountInCents: amount * 100, 
    status, 
    date: new Date().toISOString().split('T')[0],
  }

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${invoiceData.customerId}, ${invoiceData.amountInCents}, ${invoiceData.status}, ${invoiceData.date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}