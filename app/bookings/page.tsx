import { BookingRow } from '@/components/booking-row';
import { TableArchive } from '@/components/table-archive';
import { getBookings } from '@/lib/api';

export default async function BookingsPage() {
  const bookings = await getBookings().catch(() => []);

  return (
    <div className="admin-page-wrap">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-copy">Manage all guest reservations.</p>
        </div>
      </div>

      <div className="admin-content-stack">
        <TableArchive
          columns={['Guest', 'Room', 'Dates', 'Price', 'Status', 'Created', 'Action']}
          emptyCopy="Bookings will appear here once guests make reservations."
          emptyIcon="📋"
          emptyTitle="No bookings found"
          hasRows={bookings.length > 0}
        >
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </TableArchive>
      </div>
    </div>
  );
}