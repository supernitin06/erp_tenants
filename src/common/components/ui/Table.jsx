import React, { useState } from 'react';
import { 
  PencilSquareIcon, 
  TrashIcon,
  ChevronUpDownIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';

const Table = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  primaryKey = 'id',
  onSort,
  onFilter,
  striped = true,
  hoverable = true,
  compact = false
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-full mb-4">
          <FunnelIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No data found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adding a new entry or adjusting your filters</p>
      </div>
    );
  }

  const primaryDisplayColumn = columns.find(c => c.isPrimary) || columns[0] || { key: primaryKey, header: 'ID' };
  const secondaryDisplayColumn = columns.find(c => c.isSecondary) || null;

  const toggleRowExpansion = (rowId) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    
    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUpDownIcon className="h-4 w-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="text-cyan-600">↑</span>
      : sortConfig.direction === 'desc'
        ? <span className="text-cyan-600">↓</span>
        : <ChevronUpDownIcon className="h-4 w-4 text-slate-400" />;
  };

  const cellPadding = compact ? 'px-3 py-2' : 'px-5 py-4';

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
        {data.map((item, index) => (
          <div 
            key={item[primaryKey]} 
            className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-cyan-200 dark:hover:border-cyan-800"
          >
            {/* Card Header with Primary Info */}
            <div 
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => toggleRowExpansion(item[primaryKey])}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                  {index + 1}
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold text-base">
                    {primaryDisplayColumn.render ? primaryDisplayColumn.render(item) : item[primaryDisplayColumn.key]}
                  </div>
                  {secondaryDisplayColumn && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {item[secondaryDisplayColumn.key]}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(onEdit || onDelete) && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item[primaryKey]); }}
                        className="p-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-400/10 rounded-lg transition-all"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                <ChevronUpDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${expandedRows[item[primaryKey]] ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRows[item[primaryKey]] && (
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  {columns
                    .filter(c => c.key !== primaryDisplayColumn.key && (!secondaryDisplayColumn || c.key !== secondaryDisplayColumn.key))
                    .map(col => (
                      <div key={col.key} className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {col.header}
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {col.render ? col.render(item) : item[col.key] || '-'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View: Single Table with Sticky Columns */}
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              {/* Primary Column - Sticky Left */}
              <th className={`${cellPadding} text-left sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {primaryDisplayColumn.header}
                  </span>
                  <button
                    onClick={() => handleSort(primaryDisplayColumn.key)}
                    className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1"
                  >
                    {getSortIcon(primaryDisplayColumn.key)}
                  </button>
                </div>
              </th>

              {/* Other Columns */}
              {columns.slice(1).map(col => (
                <th key={col.key} className={`${cellPadding} text-left whitespace-nowrap`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {col.header}
                    </span>
                    <button
                      onClick={() => handleSort(col.key)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1"
                    >
                      {getSortIcon(col.key)}
                    </button>
                  </div>
                </th>
              ))}

              {/* Actions Column - Sticky Right */}
              {(onEdit || onDelete) && (
                <th className={`${cellPadding} text-right sticky right-0 z-20 bg-slate-50 dark:bg-slate-800 shadow-[-4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((item, index) => (
              <tr 
                key={item[primaryKey]} 
                className={`
                  ${striped && index % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}
                  ${hoverable ? 'hover:bg-slate-100 dark:hover:bg-slate-700/50' : ''}
                  transition-colors duration-150
                `}
              >
                {/* Primary Cell - Sticky Left */}
                <td className={`${cellPadding} font-medium text-slate-900 dark:text-white sticky left-0 z-10 ${striped && index % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'} shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full">
                      {index + 1}
                    </span>
                    {primaryDisplayColumn.render ? primaryDisplayColumn.render(item) : <span>{item[primaryDisplayColumn.key]}</span>}
                    {secondaryDisplayColumn && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {item[secondaryDisplayColumn.key]}
                      </span>
                    )}
                  </div>
                </td>

                {/* Other Cells */}
                {columns.slice(1).map(col => (
                  <td key={col.key} className={`${cellPadding} whitespace-nowrap text-slate-600 dark:text-slate-300`}>
                    {col.render ? col.render(item) : item[col.key] || '-'}
                  </td>
                ))}

                {/* Actions Cell - Sticky Right */}
                {(onEdit || onDelete) && (
                  <td className={`${cellPadding} text-right sticky right-0 z-10 ${striped && index % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'} shadow-[-4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                    <div className="flex justify-end items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item[primaryKey])}
                          className="p-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-400/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          background-clip: content-box;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #475569;
          background-clip: content-box;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #64748b;
          background-clip: content-box;
        }
      `}</style>
    </div>
  );
};

export default Table;