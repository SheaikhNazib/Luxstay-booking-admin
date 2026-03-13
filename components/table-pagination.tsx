import Link from 'next/link';

interface TablePaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  query?: Record<string, string | undefined>;
}

function createHref(
  basePath: string,
  query: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const paramString = params.toString();
  return paramString ? `${basePath}?${paramString}` : basePath;
}

function getPageNumbers(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

export function TablePagination({
  basePath,
  currentPage,
  totalPages,
  query = {},
}: TablePaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Table pagination"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
    >
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage === 1 ? (
          <span
            aria-disabled="true"
            className="inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Previous
          </span>
        ) : (
          <Link
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            href={createHref(basePath, query, currentPage - 1)}
          >
            Previous
          </Link>
        )}

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span aria-hidden="true" className="px-1 text-sm text-slate-400" key={`ellipsis-${index}`}>
              ...
            </span>
          ) : (
            <Link
              aria-current={page === currentPage ? 'page' : undefined}
              className={
                page === currentPage
                  ? 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-navy bg-navy px-3 text-sm font-semibold text-white! visited:text-white! hover:text-white!'
                  : 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50'
              }
              href={createHref(basePath, query, page)}
              key={page}
            >
              {page}
            </Link>
          ),
        )}

        {currentPage === totalPages ? (
          <span
            aria-disabled="true"
            className="inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Next
          </span>
        ) : (
          <Link
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            href={createHref(basePath, query, currentPage + 1)}
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
