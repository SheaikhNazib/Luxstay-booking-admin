import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OpenImageButton } from '@/components/open-image-button';
import { getServiceById } from '@/lib/api';

interface ServiceViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceViewPage({ params }: ServiceViewPageProps) {
  const { id } = await params;
  const service = await getServiceById(id).catch(() => null);

  if (!service) {
    notFound();
  }

  return (
    <div className="admin-page-wrap">
      <div className="admin-page-head flex items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">{service.name}</h1>
          <p className="admin-page-copy">View room details and inventory information.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link className="admin-button-danger inline-flex items-center justify-center" href="/services">
            Back to Services
          </Link>
          <Link className="admin-button-primary inline-flex items-center justify-center" href={`/services/${service.id}/edit`}>
            Edit Room
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="admin-card space-y-6">
          <div>
            <p className="admin-kicker">Overview</p>
            <h2 className="admin-section-title">Room information</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="admin-table-sub">Price</p>
              <p className="admin-table-main text-2xl">${Number(service.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="admin-table-sub">Capacity</p>
              <p className="admin-table-main text-2xl">{service.capacity} guests</p>
            </div>
            <div className="md:col-span-2">
              <p className="admin-table-sub">Description</p>
              <p className="mt-2 leading-7 text-slate-600">{service.description}</p>
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
              <p className="admin-table-sub">Service ID</p>
              <p className="admin-table-main break-all">{service.id}</p>
            </div>
            <div>
              <p className="admin-table-sub">Created</p>
              <p className="admin-table-main">{new Date(service.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="admin-table-sub">Last updated</p>
              <p className="admin-table-main">{new Date(service.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {service.image ? (
            <div className="space-y-3">
              <p className="admin-table-sub">Image preview</p>
              <div
                aria-label={`${service.name} preview`}
                className="h-64 w-full rounded-lg bg-slate-100 bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <OpenImageButton label="Open original image" src={service.image} />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
              No image available for this room.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
