import { BookingRow } from '@/components/booking-row';
import { SearchInput } from '@/components/search-input';
import { TablePagination } from '@/components/table-pagination';
import { getBookings, getServices } from '@/lib/api';
import Link from 'next/link';

const PAGE_SIZE = 8;

interface HomeProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? '';
  const pageValue = Number(params.page);
  const requestedPage = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

  const [services, bookings] = await Promise.all([
    getServices().catch(() => []),
    getBookings().catch(() => []),
  ]);

  const revenue = bookings.reduce((sum, booking) => sum + Number(booking.price), 0);
  const paidBookings = bookings.filter((booking) => booking.paymentStatus === 'paid').length;
  const loweredQuery = query.toLowerCase();

  const filteredBookings = loweredQuery
    ? bookings.filter((booking) => {
        const serviceName = booking.service?.name ?? '';

        return (
          booking.userName.toLowerCase().includes(loweredQuery) ||
          booking.email.toLowerCase().includes(loweredQuery) ||
          serviceName.toLowerCase().includes(loweredQuery) ||
          booking.paymentStatus.toLowerCase().includes(loweredQuery)
        );
      })
    : bookings;

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedBookings = filteredBookings.slice(startIndex, startIndex + PAGE_SIZE);

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

      <SearchInput
        clearHref="/"
        initialQuery={query}
        inputId="dashboard-bookings-search"
        placeholder="Search bookings by guest, email, room, or status"
      />

      <section className="admin-card admin-table-card">
        <div className="admin-table-head px-3 py-2">
          <h2 className="admin-card-title">Bookings Overview</h2>
          <Link className="admin-link-gold" href="/bookings">
            View all
          </Link>
        </div>

        {pagedBookings.length === 0 ? (
          <div className="admin-empty-card admin-empty-tight">
            <p className="admin-empty-icon">📋</p>
            <p className="admin-empty-title">No bookings found</p>
            {query ? (
              <p className="admin-empty-copy">No bookings match "{query}". Try another keyword.</p>
            ) : null}
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
                {pagedBookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-3 pb-3 pt-2">
          <TablePagination
            basePath="/"
            currentPage={currentPage}
            query={{ q: query || undefined }}
            totalPages={totalPages}
          />
        </div>
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
