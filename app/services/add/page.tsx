import Link from 'next/link';
import { ServiceCreateForm } from '@/components/service-create-form';

export default function AddServicePage() {
  return (
    <div className="admin-page-wrap">
      <div className="admin-page-head flex items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Add Room</h1>
          <p className="admin-page-copy">Create a new room or service for the booking system.</p>
        </div>

        <Link className="admin-button-danger inline-flex items-center justify-center" href="/services">
          Back to Services
        </Link>
      </div>

      <div className="admin-content-stack">
        <ServiceCreateForm />
      </div>
    </div>
  );
}
