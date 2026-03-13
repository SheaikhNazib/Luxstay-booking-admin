import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookingById } from '@/lib/api';

interface BookingViewPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

export default async function BookingViewPage({ params }: BookingViewPageProps) {
  const { id } = await params;
  const booking = await getBookingById(id).catch(() => null);

  if (!booking) {
    notFound();
  }

  return (
    <div className="admin-page-wrap">
      <div className="admin-page-head flex items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Booking Details</h1>
          <p className="admin-page-copy">View full reservation information for this guest.</p>
        </div>
        <Link className="admin-button-secondary inline-flex items-center justify-center" href="/bookings">
          Back to Bookings
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="admin-card space-y-6">
          <div>
            <p className="admin-kicker">Guest</p>
            <h2 className="admin-section-title">Reservation information</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="admin-table-sub">Guest name</p>
              <p className="admin-table-main">{booking.userName}</p>
            </div>
            <div>
              <p className="admin-table-sub">Email</p>
              <p className="admin-table-main break-all">{booking.email}</p>
            </div>
            <div>
              <p className="admin-table-sub">Check-in</p>
              <p className="admin-table-main">{booking.checkInDate}</p>
            </div>
            <div>
              <p className="admin-table-sub">Check-out</p>
              <p className="admin-table-main">{booking.checkOutDate}</p>
            </div>
            <div>
              <p className="admin-table-sub">Total price</p>
              <p className="admin-table-main text-2xl">${Number(booking.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="admin-table-sub">Payment status</p>
              <span className={`status-chip status-${booking.paymentStatus}`}>
                {STATUS_LABELS[booking.paymentStatus] ?? booking.paymentStatus}
              </span>
            </div>
          </div>
        </article>

        <aside className="admin-card space-y-5">
          <div>
            <p className="admin-kicker">Metadata</p>
            <h2 className="admin-section-title">Record details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="admin-table-sub">Booking ID</p>
              <p className="admin-table-main break-all">{booking.id}</p>
            </div>
            <div>
              <p className="admin-table-sub">Room</p>
              <p className="admin-table-main">{booking.service?.name ?? booking.serviceId}</p>
            </div>
            {booking.service && (
              <div>
                <p className="admin-table-sub">Room price</p>
                <p className="admin-table-main">${Number(booking.service.price).toFixed(2)} / night</p>
              </div>
            )}
            {booking.stripeSessionId && (
              <div>
                <p className="admin-table-sub">Stripe session</p>
                <p className="admin-table-main break-all text-xs">{booking.stripeSessionId}</p>
              </div>
            )}
            <div>
              <p className="admin-table-sub">Created</p>
              <p className="admin-table-main">{new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {booking.service && (
            <div className="border-t border-slate-100 pt-4">
              <Link
                className="admin-link-gold text-sm"
                href={`/services/${booking.service.id}`}
              >
                View room details →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
