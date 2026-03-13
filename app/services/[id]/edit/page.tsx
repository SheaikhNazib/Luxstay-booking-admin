import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServiceEditorCard } from '@/components/service-editor-card';
import { getServiceById } from '@/lib/api';

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await getServiceById(id).catch(() => null);

  if (!service) {
    notFound();
  }

  return (
    <div className="admin-page-wrap">
      <div className="admin-page-head flex items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Edit Room</h1>
          <p className="admin-page-copy">Update room information, price, capacity, and image.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link className="admin-button-danger inline-flex items-center justify-center" href={`/services/${service.id}`}>
            View Room
          </Link>
          <Link className="admin-button-primary inline-flex items-center justify-center" href="/services">
            Back to Services
          </Link>
        </div>
      </div>

      <div className="admin-content-stack">
        <ServiceEditorCard service={service} />
      </div>
    </div>
  );
}
