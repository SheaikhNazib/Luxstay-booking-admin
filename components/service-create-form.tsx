'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import { createServiceAction, type AdminActionState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';

const initialState: AdminActionState = {};

export function ServiceCreateForm() {
  const [state, formAction] = useActionState(createServiceAction, initialState);
  const [imageValue, setImageValue] = useState('');
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
    <form action={formAction} className="admin-card space-y-4">
      <div>
        <p className="admin-kicker">Create service</p>
        <h2 className="admin-section-title">Add a new room</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="admin-field">
          <span>Name</span>
          <input name="name" placeholder="Deluxe King Room" required type="text" />
        </label>
        <label className="admin-field">
          <span>Nightly price</span>
          <input min="1" name="price" placeholder="199.99" required step="0.01" type="number" />
        </label>
        <label className="admin-field md:col-span-2">
          <span>Description</span>
          <textarea name="description" placeholder="Spacious room with ocean view and king bed." required rows={4} />
        </label>
        <label className="admin-field">
          <span>Capacity</span>
          <input min="1" name="capacity" placeholder="2" required type="number" />
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
              alt="Selected room preview"
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
      </div>

      {imageError ? <p className="admin-message admin-message-error">{imageError}</p> : null}
      {state.error ? <p className="admin-message admin-message-error">{state.error}</p> : null}
      {state.success ? <p className="admin-message admin-message-success">{state.success}</p> : null}

      <SubmitButton className="admin-button-primary" idleLabel="Create room" pendingLabel="Creating..." />
    </form>
  );
}