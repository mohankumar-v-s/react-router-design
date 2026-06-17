import React, { useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import { Chip, ActionIcon, Group, Badge } from '@mantine/core';
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
                return 'green';
            case 'inactive':
                return 'red';
            case 'pending':
                return 'yellow';
            default:
                return 'gray';
        }
    };

    const getLossProfitColor = (lossProfit: number): string => {
        return lossProfit >= 0 ? 'green' : 'red';
    };

    const columns = useMemo<MRT_ColumnDef<PropertyTypes>[]>(
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
                Cell: ({ cell }) => (
                    <Badge variant="light" capitalize>
                        {cell.getValue<string>()}
                    </Badge>
                ),
            },
            {
                accessorKey: 'buyPrice',
                header: 'Buy Price',
                size: 120,
                Cell: ({ cell }) => `$${(cell.getValue<number>()).toLocaleString()}`,
            },
            {
                accessorKey: 'sellPrice',
                header: 'Sell Price',
                size: 120,
                Cell: ({ cell }) => `$${(cell.getValue<number>()).toLocaleString()}`,
            },
            {
                id: 'lossProfit',
                header: 'Loss/Profit',
                size: 120,
                Cell: ({ row }) => {
                    const lossProfit = row.original.sellPrice - row.original.buyPrice;
                    return (
                        <Badge
                            color={getLossProfitColor(lossProfit)}
                            variant="filled"
                        >
                            {lossProfit >= 0 ? '+' : ''} ${Math.abs(lossProfit).toLocaleString()}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        color={getStatusColor(cell.getValue<PropertyTypes['status']>())}
                        variant="filled"
                        capitalize
                    >
                        {cell.getValue<string>()}
                    </Badge>
                ),
            },
            {
                accessorKey: 'id',
                header: 'Actions',
                size: 100,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <Group noWrap>
                        <ActionIcon
                            size="sm"
                            color="blue"
                            variant="subtle"
                            onClick={() => onEdit(row.original)}
                        >
                            <Edit2 size={16} />
                        </ActionIcon>
                        <ActionIcon
                            size="sm"
                            color="red"
                            variant="subtle"
                            onClick={() => onDelete(row.original.id)}
                        >
                            <Trash2 size={16} />
                        </ActionIcon>
                    </Group>
                ),
            },
        ],
        [onEdit, onDelete]
    );

    const table = useMantineReactTable({
        columns,
        data: properties,
        state: {
            isLoading: loading,
        },
        enableRowSelection: false,
        enablePagination: true,
        enableColumnFilters: true,
        enableSorting: true,
        mantineTableProps: {
            // striped: 'odd',
            highlightOnHover: true,
        },
    });

    return <MantineReactTable table={table} />;
}
