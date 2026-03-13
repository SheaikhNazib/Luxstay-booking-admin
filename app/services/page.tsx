import Link from 'next/link';
import { OpenImageButton } from '@/components/open-image-button';
import { ServiceActionsMenu } from '@/components/service-actions-menu';
import { TableArchive } from '@/components/table-archive';
import { getServices } from '@/lib/api';

export default async function ServicesPage() {
  const services = await getServices().catch(() => []);

  return (
    <div className="admin-page-wrap">
      <div className="admin-page-head">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="admin-page-title">Services</h1>
            <p className="admin-page-copy">Manage hotel rooms and service inventory.</p>
          </div>

          <Link className="admin-button-primary inline-flex items-center justify-center" href="/services/add">
            Add Room
          </Link>
        </div>
      </div>

      <div className="admin-content-stack">
        <TableArchive
          columns={['Room', 'Price', 'Capacity', 'Image', 'Created', 'Action']}
          emptyCopy="Create your first room with the Add Room button."
          emptyIcon="🏨"
          emptyTitle="No services yet"
          hasRows={services.length > 0}
        >
          {services.map((service) => (
            <tr key={service.id}>
              <td>
                <div className="admin-table-main">{service.name}</div>
                <div className="admin-table-sub">{service.description}</div>
              </td>
              <td>${Number(service.price).toFixed(2)}</td>
              <td>{service.capacity}</td>
              <td>
                {service.image ? (
                  <OpenImageButton src={service.image} />
                ) : (
                  <span className="admin-empty-cell">No image</span>
                )}
              </td>
              <td>{new Date(service.createdAt).toLocaleDateString()}</td>
              <td>
                <ServiceActionsMenu serviceId={service.id} />
              </td>
            </tr>
          ))}
        </TableArchive>
      </div>
    </div>
  );
}