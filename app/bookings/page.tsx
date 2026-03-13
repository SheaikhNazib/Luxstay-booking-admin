import { BookingRow } from '@/components/booking-row';
import { SearchInput } from '../../components/search-input';
import { TablePagination } from '@/components/table-pagination';
import { TableArchive } from '@/components/table-archive';
import { getBookings } from '@/lib/api';

const PAGE_SIZE = 8;

interface BookingsPageProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? '';
  const pageValue = Number(params.page);
  const requestedPage = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

  const bookings = await getBookings().catch(() => []);
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
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-copy">Manage all guest reservations.</p>
        </div>
      </div>

      <SearchInput
        clearHref="/bookings"
        initialQuery={query}
        inputId="bookings-search"
        placeholder="Search bookings by guest, email, room, or status"
      />

      <div className="admin-content-stack">
        <TableArchive
          columns={['Guest', 'Room', 'Dates', 'Price', 'Status', 'Created', 'Action']}
          emptyCopy={
            query
              ? `No bookings match \"${query}\". Try another keyword.`
              : 'Bookings will appear here once guests make reservations.'
          }
          emptyIcon="📋"
          emptyTitle="No bookings found"
          hasRows={pagedBookings.length > 0}
        >
          {pagedBookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </TableArchive>

        <TablePagination
          basePath="/bookings"
          currentPage={currentPage}
          query={{ q: query || undefined }}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}