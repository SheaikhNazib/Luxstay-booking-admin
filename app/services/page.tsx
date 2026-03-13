import Link from 'next/link';
import { OpenImageButton } from '@/components/open-image-button';
import { ServiceActionsMenu } from '@/components/service-actions-menu';
import { SearchInput } from '../../components/search-input';
import { TablePagination } from '@/components/table-pagination';
import { TableArchive } from '@/components/table-archive';
import { getServices } from '@/lib/api';

const PAGE_SIZE = 8;

interface ServicesPageProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? '';
  const pageValue = Number(params.page);
  const requestedPage = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

  const services = await getServices().catch(() => []);
  const loweredQuery = query.toLowerCase();

  const filteredServices = loweredQuery
    ? services.filter((service) => {
        return (
          service.name.toLowerCase().includes(loweredQuery) ||
          service.description.toLowerCase().includes(loweredQuery)
        );
      })
    : services;

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedServices = filteredServices.slice(startIndex, startIndex + PAGE_SIZE);

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

      <SearchInput
        clearHref="/services"
        initialQuery={query}
        inputId="services-search"
        placeholder="Search rooms by name or description"
      />

      <div className="admin-content-stack">
        <TableArchive
          columns={['Room', 'Price', 'Capacity', 'Image', 'Created', 'Action']}
          emptyCopy={
            query
              ? `No rooms match \"${query}\". Try another keyword.`
              : 'Create your first room with the Add Room button.'
          }
          emptyIcon="🏨"
          emptyTitle="No services yet"
          hasRows={pagedServices.length > 0}
        >
          {pagedServices.map((service) => (
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

        <TablePagination
          basePath="/services"
          currentPage={currentPage}
          query={{ q: query || undefined }}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}