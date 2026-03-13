import 'server-only';

import { cache } from 'react';
import type { BookingItem, ServiceItem } from '@/lib/types';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';

async function requestBackend<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message ?? 'Request failed';
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  return requestBackend<ServiceItem[]>('/services', { method: 'GET' });
});

export const getServiceById = cache(async (id: string): Promise<ServiceItem> => {
  return requestBackend<ServiceItem>(`/services/${id}`, { method: 'GET' });
});

export const getBookings = cache(async (): Promise<BookingItem[]> => {
  return requestBackend<BookingItem[]>('/bookings', { method: 'GET' });
});

export const getBookingById = cache(async (id: string): Promise<BookingItem> => {
  return requestBackend<BookingItem>(`/bookings/${id}`, { method: 'GET' });
});

export async function createService(payload: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>) {
  return requestBackend<ServiceItem>('/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateService(id: string, payload: Partial<Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>>) {
  return requestBackend<ServiceItem>(`/services/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteService(id: string) {
  return requestBackend<void>(`/services/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteBooking(id: string) {
  return requestBackend<void>(`/bookings/${id}`, {
    method: 'DELETE',
  });
}