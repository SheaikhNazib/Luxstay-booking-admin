'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createService, deleteBooking, deleteService, updateService } from '@/lib/api';

export interface AdminActionState {
  error?: string;
  success?: string;
}

function parseNumber(value: FormDataEntryValue | null) {
  return Number(value?.toString() ?? '0');
}

export async function createServiceAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await createService({
      name: formData.get('name')?.toString().trim() ?? '',
      description: formData.get('description')?.toString().trim() ?? '',
      price: parseNumber(formData.get('price')),
      capacity: parseNumber(formData.get('capacity')),
      image: formData.get('image')?.toString().trim() || undefined,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to create room.' };
  }

  revalidatePath('/');
  revalidatePath('/services');
  redirect('/services');
}

export async function updateServiceAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = formData.get('id')?.toString() ?? '';

  try {
    await updateService(id, {
      name: formData.get('name')?.toString().trim() ?? '',
      description: formData.get('description')?.toString().trim() ?? '',
      price: parseNumber(formData.get('price')),
      capacity: parseNumber(formData.get('capacity')),
      image: formData.get('image')?.toString().trim() || undefined,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to update room.' };
  }

  revalidatePath('/');
  revalidatePath('/services');
  redirect('/services');
}

export async function deleteServiceAction(formData: FormData) {
  const id = formData.get('id')?.toString() ?? '';
  await deleteService(id);
  revalidatePath('/');
}

export async function deleteBookingAction(formData: FormData) {
  const id = formData.get('id')?.toString() ?? '';
  await deleteBooking(id);
  revalidatePath('/');
}