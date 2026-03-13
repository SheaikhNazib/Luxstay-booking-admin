'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import { deleteServiceAction, updateServiceAction, type AdminActionState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import type { ServiceItem } from '@/lib/types';

const initialState: AdminActionState = {};

interface ServiceEditorCardProps {
  service: ServiceItem;
}

export function ServiceEditorCard({ service }: ServiceEditorCardProps) {
  const [state, updateAction] = useActionState(updateServiceAction, initialState);
  const [imageValue, setImageValue] = useState(service.image ?? '');
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function compressImageFile(file: File): Promise<string> {
    const bitmap = await createImageBitmap(file);
    const maxSize = 1200;
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is not available in this browser.');
    }

    context.drawImage(bitmap, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.78);
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Please select an image smaller than 5 MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose a valid image file.');
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file);
      setImageError(null);
      setImageValue(compressedDataUrl);
    } catch {
      setImageError('Unable to read the selected image. Please try another file.');
    }
  }

  function clearImageSelection() {
    setImageError(null);
    setImageValue('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <article className="admin-card space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="admin-kicker">Service</p>
          <h3 className="text-2xl font-semibold text-navy">{service.name}</h3>
        </div>
        <form action={deleteServiceAction}>
          <input name="id" type="hidden" value={service.id} />
          <SubmitButton className="admin-button-danger" idleLabel="Delete" pendingLabel="Deleting..." />
        </form>
      </div>

      <form action={updateAction} className="grid gap-4 md:grid-cols-2">
        <input name="id" type="hidden" value={service.id} />
        <label className="admin-field">
          <span>Name</span>
          <input defaultValue={service.name} name="name" required type="text" />
        </label>
        <label className="admin-field">
          <span>Price</span>
          <input defaultValue={Number(service.price)} min="1" name="price" required step="0.01" type="number" />
        </label>
        <label className="admin-field md:col-span-2">
          <span>Description</span>
          <textarea defaultValue={service.description} name="description" required rows={4} />
        </label>
        <label className="admin-field">
          <span>Capacity</span>
          <input defaultValue={service.capacity} min="1" name="capacity" required type="number" />
        </label>
        <label className="admin-field md:col-span-2">
          <span>Upload from computer</span>
          <input accept="image/*" onChange={handleImageFileChange} ref={fileInputRef} type="file" />
          <small className="text-xs text-slate-500">Image is auto-optimized before upload.</small>
        </label>
        <input name="image" type="hidden" value={imageValue} />

        {imageValue ? (
          <div className="md:col-span-2 max-w-md rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-sm font-medium text-slate-600">Image preview</p>
            <Image
              alt={`${service.name} preview`}
              className="h-40 w-full rounded-md object-cover"
              height={160}
              src={imageValue}
              unoptimized
              width={420}
            />
            <button className="admin-button-danger mt-3" onClick={clearImageSelection} type="button">
              Remove image
            </button>
          </div>
        ) : null}

        {imageError ? <p className="admin-message admin-message-error md:col-span-2">{imageError}</p> : null}
        {state.error ? <p className="admin-message admin-message-error md:col-span-2">{state.error}</p> : null}
        {state.success ? <p className="admin-message admin-message-success md:col-span-2">{state.success}</p> : null}

        <div className="md:col-span-2">
          <SubmitButton className="admin-button-primary" idleLabel="Save changes" pendingLabel="Saving..." />
        </div>
      </form>
    </article>
  );
}