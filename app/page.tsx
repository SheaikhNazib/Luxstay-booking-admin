import { BookingRow } from '@/components/booking-row';
import { getBookings, getServices } from '@/lib/api';
import Link from 'next/link';

export default async function Home() {
  const [services, bookings] = await Promise.all([
    getServices().catch(() => []),
    getBookings().catch(() => []),
  ]);

  const revenue = bookings.reduce((sum, booking) => sum + Number(booking.price), 0);
  const paidBookings = bookings.filter((booking) => booking.paymentStatus === 'paid').length;
  const recent = bookings.slice(0, 8);

  return (
    <div className="admin-page-wrap">
      <section className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-copy">
            Welcome back. Here is a quick summary of your hotel operations.
          </p>
        </div>
      </section>

      <section className="admin-stats-grid">
        <Link className="admin-stat-card" href="/services">
          <p>Total Rooms</p>
          <strong>{services.length}</strong>
        </Link>
        <Link className="admin-stat-card" href="/bookings">
          <p>Total Bookings</p>
          <strong>{bookings.length}</strong>
        </Link>
        <Link className="admin-stat-card" href="/bookings">
          <p>Paid Bookings</p>
          <strong>{paidBookings}</strong>
        </Link>
        <Link className="admin-stat-card" href="/bookings">
          <p>Total Revenue</p>
          <strong>${revenue.toFixed(2)}</strong>
        </Link>
      </section>

      <section className="admin-card admin-table-card">
        <div className="admin-table-head px-3 py-2">
          <h2 className="admin-card-title">Recent Bookings</h2>
          <Link className="admin-link-gold" href="/bookings">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="admin-empty-card admin-empty-tight">
            <p className="admin-empty-icon">📋</p>
            <p className="admin-empty-title">No bookings yet</p>
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-quick-links mt-4">
        <Link className="admin-quick-card" href="/services">
          <h3>Manage Services</h3>
          <p>Create, edit, or delete room listings.</p>
        </Link>
        <Link className="admin-quick-card" href="/bookings">
          <h3>Manage Bookings</h3>
          <p>Review reservations and cancel records.</p>
        </Link>
      </section>
    </div>
  );
}
