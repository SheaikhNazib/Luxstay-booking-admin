import type { ReactNode } from 'react';

interface TableArchiveProps {
  columns: string[];
  hasRows: boolean;
  emptyIcon: string;
  emptyTitle: string;
  emptyCopy?: string;
  children: ReactNode;
}

export function TableArchive({
  columns,
  hasRows,
  emptyIcon,
  emptyTitle,
  emptyCopy,
  children,
}: TableArchiveProps) {
  return (
    <div className="admin-card admin-table-card">
      {!hasRows ? (
        <div className="admin-empty-card admin-empty-tight">
          <p className="admin-empty-icon">{emptyIcon}</p>
          <p className="admin-empty-title">{emptyTitle}</p>
          {emptyCopy ? <p className="admin-empty-copy">{emptyCopy}</p> : null}
        </div>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
