'use client';

import { BookingActionsMenu } from '@/components/booking-actions-menu';
import type { BookingItem } from '@/lib/types';

interface BookingRowProps {
  booking: BookingItem;
}

export function BookingRow({ booking }: BookingRowProps) {
  return (
    <tr>
      <td>
        <div className="admin-table-main">{booking.userName}</div>
        <div className="admin-table-sub">{booking.email}</div>
      </td>
      <td>{booking.service?.name ?? booking.serviceId}</td>
      <td>
        {booking.checkInDate} to {booking.checkOutDate}
      </td>
      <td>${Number(booking.price).toFixed(2)}</td>
      <td>
        <span className={`status-chip status-${booking.paymentStatus}`}>{booking.paymentStatus}</span>
      </td>
      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
      <td>
        <BookingActionsMenu bookingId={booking.id} />
      </td>
    </tr>
  );
}