import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
} from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import type { PropertyTypes } from '../utils/propertyTypes';

interface PropertyTableProps {
    properties: PropertyTypes[];
    loading: boolean;
    onEdit: (property: PropertyTypes) => void;
    onDelete: (id: string) => void;
}

export default function PropertyTable({
    properties,
    loading,
    onEdit,
    onDelete,
}: PropertyTableProps) {
    const getStatusColor = (status: PropertyTypes['status']): string => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'inactive':
                return 'bg-red-100 text-red-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getLossProfitColor = (lossProfit: number): string => {
        return lossProfit >= 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';
    };

    const columns = useMemo<ColumnDef<PropertyTypes>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                size: 150,
            },
            {
                accessorKey: 'description',
                header: 'Description',
                size: 150,
            },
            {
                accessorKey: 'propertyType',
                header: 'Property Type',
                size: 120,
                cell: (info) => (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                        {info.getValue<string>()}
                    </span>
                ),
            },
            {
                accessorKey: 'buyPrice',
                header: 'Buy Price',
                size: 120,
                cell: (info) => `$${(info.getValue<number>()).toLocaleString()}`,
            },
            {
                accessorKey: 'sellPrice',
                header: 'Sell Price',
                size: 120,
                cell: (info) => `$${(info.getValue<number>()).toLocaleString()}`,
            },
            {
                id: 'lossProfit',
                header: 'Loss/Profit',
                size: 120,
                cell: (info) => {
                    const lossProfit = info.row.original.sellPrice - info.row.original.buyPrice;
                    return (
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getLossProfitColor(lossProfit)}`}
                        >
                            {lossProfit >= 0 ? '+' : ''} ${Math.abs(lossProfit).toLocaleString()}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 100,
                cell: (info) => (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(info.getValue<PropertyTypes['status']>())}`}
                    >
                        {info.getValue<string>()}
                    </span>
                ),
            },
            {
                accessorKey: 'id',
                header: 'Actions',
                size: 100,
                enableSorting: false,
                enableHiding: false,
                cell: (info) => (
                    <div className="flex items-center gap-1">
                        <button
                            className="inline-flex items-center justify-center rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => onEdit(info.row.original)}
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            className="inline-flex items-center justify-center rounded-md p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => onDelete(info.row.original.id)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [onEdit, onDelete]
    );

    const table = useReactTable({
        columns,
        data: properties,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: false,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        style={{ width: header.getSize() }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-12 text-center text-sm text-gray-500"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                        Loading...
                                    </div>
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-12 text-center text-sm text-gray-500"
                                >
                                    No properties found
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rows per page:</span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {[10, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="text-sm text-gray-500">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
