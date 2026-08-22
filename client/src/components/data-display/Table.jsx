import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../feedback/EmptyState';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display.',
  rowKey = 'id',
  onRowClick,
}) => {
  return (
    <div className="df-table-container">
      <table className="df-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.title} style={col.width ? { width: col.width } : undefined}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>
                    <Skeleton height="20px" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((row, rIdx) => {
              const key = row[rowKey] || rIdx;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key || col.title}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
