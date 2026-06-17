// app/routes/organizationSearch.tsx
// React Router v7 Framework Mode Route

import { useState, useCallback, useRef } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
} from "@tanstack/react-table";
import { Button, Input, Tooltip, Chip, Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@heroui/react";
import {
    IconSearch,
    IconBuildingCommunity,
    IconChevronLeft,
    IconChevronRight,
    IconX,
    IconMapPin,
    IconId,
    IconTag,
} from "@tabler/icons-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface OrgItem {
    ein: string;
    name: string;
    city: string;
    state: string;
    country: string;
    dba: string | null;
    types: string;
}

interface SearchResponse {
    message: string;
    items: OrgItem[];
    count: number;
}

interface OrgDetail {
    ein?: string;
    legalName?: string;
    dbaName?: string;
    city?: string;
    state?: string;
    country?: string;
    subsection?: string;
    classification?: string;
    ruling?: string;
    deductibility?: string;
    foundation?: string;
    activity?: string;
    organization?: string;
    status?: string;
    taxPeriod?: string;
    assetCd?: string;
    incomeCd?: string;
    filingReqCd?: string;
    pfFilingReqCd?: string;
    acctPd?: string;
    assetAmt?: string;
    incomeAmt?: string;
    revenueAmt?: string;
    nteecc?: string;
    sortName?: string;
    [key: string]: unknown;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

const BASE_SEARCH =
    "https://apps.irs.gov/teos/searchAll/orgName";
const BASE_DETAIL =
    "https://apps.irs.gov/teos/details/ePostSearch";

async function fetchOrganizations(
    query: string,
    page: number,
    rows = 25
): Promise<SearchResponse> {
    const url = `${BASE_SEARCH}?orgName=${encodeURIComponent(
        query
    )}&country=US&rows=${rows}&page=${page}&sortBy=name&flow=asc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    return res.json();
}

async function fetchOrgDetail(ein: string): Promise<OrgDetail> {
    const res = await fetch(`${BASE_DETAIL}/${ein}`);
    if (!res.ok) throw new Error(`Detail fetch failed: ${res.status}`);
    return res.json();
}

// ─── Detail Drawer ───────────────────────────────────────────────────────────

function DetailRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid #f3f4f6" }}>
            <span className="text-xs font-semibold text-gray-400 uppercase" style={{ letterSpacing: "0.05em" }}>
                {label}
            </span>
            <span className="text-sm font-medium text-right" style={{ maxWidth: "60%" }}>
                {value}
            </span>
        </div>
    );
}

function DetailDrawer({
    isOpen,
    onClose,
    ein,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
    currentName,
}: {
    isOpen: boolean;
    onClose: () => void;
    ein: string | null;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
    currentName: string;
}) {
    const [detail, setDetail] = useState<OrgDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const prevEin = useRef<string | null>(null);

    // Fetch when ein changes and drawer is open
    if (ein && ein !== prevEin.current && isOpen) {
        prevEin.current = ein;
        setLoading(true);
        setError(null);
        setDetail(null);
        fetchOrgDetail(ein)
            .then((d) => setDetail(d))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            placement="right"
            size="md"
            classNames={{
                base: "bg-white dark:bg-zinc-900",
                header: "border-b border-gray-100",
                body: "p-0",
            }}
        >
            <DrawerContent>
                {/* Header */}
                <DrawerHeader className="flex flex-col gap-1 px-5 py-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-400 uppercase" style={{ letterSpacing: "0.08em" }}>
                                Organization Details
                            </p>
                            <p
                                className="font-bold text-base mt-1"
                                style={{
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {currentName}
                            </p>
                            {ein && (
                                <div className="mt-2">
                                    <Chip size="sm" color="primary" variant="light" startContent={<IconId size={10} />}>
                                        EIN: {ein}
                                    </Chip>
                                </div>
                            )}
                        </div>
                        <Button isIconOnly variant="ghost" size="sm" onPress={onClose}>
                            <IconX size={16} />
                        </Button>
                    </div>

                    {/* Prev / Next */}
                    <div className="flex items-center gap-2 mt-2.5">
                        <Tooltip content="Previous organization">
                            <Button
                                isIconOnly
                                variant="bordered"
                                size="sm"
                                isDisabled={!hasPrev}
                                onPress={onPrev}
                            >
                                <IconChevronLeft size={14} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Next organization">
                            <Button
                                isIconOnly
                                variant="bordered"
                                size="sm"
                                isDisabled={!hasNext}
                                onPress={onNext}
                            >
                                <IconChevronRight size={14} />
                            </Button>
                        </Tooltip>
                    </div>
                </DrawerHeader>

                {/* Body */}
                <DrawerBody>
                    <div className="px-5 py-4">
                        {loading && (
                            <div className="flex items-center justify-center h-[200px]">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                    <span className="text-xs text-gray-400">Loading details…</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-sm text-red-600">
                                    Failed to load: {error}
                                </p>
                            </div>
                        )}

                        {detail && !loading && (
                            <div className="flex flex-col gap-0">
                                {/* Identity */}
                                <p
                                    className="text-xs font-bold text-blue-600 mb-1.5 uppercase"
                                    style={{ letterSpacing: "0.08em" }}
                                >
                                    Identity
                                </p>
                                <DetailRow label="Legal Name" value={detail.legalName} />
                                <DetailRow label="DBA Name" value={detail.dbaName} />
                                <DetailRow label="Sort Name" value={detail.sortName} />
                                <DetailRow label="EIN" value={detail.ein} />

                                <hr className="my-3.5 border-gray-200" />

                                {/* Location */}
                                <p
                                    className="text-xs font-bold text-blue-600 mb-1.5 uppercase"
                                    style={{ letterSpacing: "0.08em" }}
                                >
                                    Location
                                </p>
                                <DetailRow label="City" value={detail.city} />
                                <DetailRow label="State" value={detail.state} />
                                <DetailRow label="Country" value={detail.country} />

                                <hr className="my-3.5 border-gray-200" />

                                {/* Classification */}
                                <p
                                    className="text-xs font-bold text-blue-600 mb-1.5 uppercase"
                                    style={{ letterSpacing: "0.08em" }}
                                >
                                    Classification
                                </p>
                                <DetailRow label="Subsection" value={detail.subsection} />
                                <DetailRow label="Classification" value={detail.classification} />
                                <DetailRow label="Foundation" value={detail.foundation} />
                                <DetailRow label="Deductibility" value={detail.deductibility} />
                                <DetailRow label="Status" value={detail.status} />
                                <DetailRow label="NTEE Code" value={detail.nteecc} />
                                <DetailRow label="Activity" value={detail.activity} />
                                <DetailRow label="Organization" value={detail.organization} />

                                <hr className="my-3.5 border-gray-200" />

                                {/* Financials */}
                                <p
                                    className="text-xs font-bold text-blue-600 mb-1.5 uppercase"
                                    style={{ letterSpacing: "0.08em" }}
                                >
                                    Financials
                                </p>
                                <DetailRow label="Tax Period" value={detail.taxPeriod} />
                                <DetailRow label="Asset Amount" value={detail.assetAmt} />
                                <DetailRow label="Income Amount" value={detail.incomeAmt} />
                                <DetailRow label="Revenue Amount" value={detail.revenueAmt} />
                                <DetailRow label="Asset Code" value={detail.assetCd} />
                                <DetailRow label="Income Code" value={detail.incomeCd} />
                                <DetailRow label="Ruling" value={detail.ruling} />
                                <DetailRow label="Account Period" value={detail.acctPd} />
                                <DetailRow label="Filing Req Code" value={detail.filingReqCd} />
                                <DetailRow label="PF Filing Req" value={detail.pfFilingReqCd} />
                            </div>
                        )}
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OrganizationSearch() {
    const [query, setQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState<OrgItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Pagination — page is 0-indexed for API
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Trigger search
    const doSearch = useCallback(
        async (searchQuery: string, pageIndex: number, pageSize: number) => {
            if (!searchQuery.trim()) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetchOrganizations(searchQuery, pageIndex, pageSize);
                setData(res.items ?? []);
                setTotalCount(res.count ?? 0);
                setHasSearched(true);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Search failed");
                setData([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleSearch = () => {
        const newQuery = inputValue.trim();
        if (!newQuery) return;
        setQuery(newQuery);
        const newPagination = { pageIndex: 0, pageSize: 25 };
        setPagination(newPagination);
        doSearch(newQuery, 0, 25);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    // When pagination changes (user clicks next/prev page in table)
    const handlePaginationChange = (
        updater: PaginationState | ((prev: PaginationState) => PaginationState)
    ) => {
        const next = typeof updater === "function" ? updater(pagination) : updater;
        setPagination(next);
        if (query) {
            doSearch(query, next.pageIndex, next.pageSize);
        }
    };

    // Open drawer for row
    const openDrawer = (index: number) => {
        setSelectedIndex(index);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    // Prev/Next in drawer — if at end of current page, flip to next page
    const handleDrawerNext = async () => {
        if (selectedIndex === null) return;
        if (selectedIndex < data.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        } else {
            // Move to next page
            const nextPage = pagination.pageIndex + 1;
            const totalPages = Math.ceil(totalCount / pagination.pageSize);
            if (nextPage < totalPages) {
                const newPagination = { ...pagination, pageIndex: nextPage };
                setPagination(newPagination);
                setLoading(true);
                try {
                    const res = await fetchOrganizations(query, nextPage, pagination.pageSize);
                    setData(res.items ?? []);
                    setTotalCount(res.count ?? 0);
                    setSelectedIndex(0);
                } catch {
                    // keep current
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const handleDrawerPrev = async () => {
        if (selectedIndex === null) return;
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        } else {
            // Move to previous page
            const prevPage = pagination.pageIndex - 1;
            if (prevPage >= 0) {
                const newPagination = { ...pagination, pageIndex: prevPage };
                setPagination(newPagination);
                setLoading(true);
                try {
                    const res = await fetchOrganizations(query, prevPage, pagination.pageSize);
                    setData(res.items ?? []);
                    setTotalCount(res.count ?? 0);
                    setSelectedIndex(res.items.length - 1);
                } catch {
                    // keep current
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const selectedOrg = selectedIndex !== null ? data[selectedIndex] : null;

    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    const hasNext =
        selectedIndex !== null &&
        (selectedIndex < data.length - 1 ||
            pagination.pageIndex < totalPages - 1);
    const hasPrev =
        selectedIndex !== null &&
        (selectedIndex > 0 || pagination.pageIndex > 0);

    // ── Columns ──────────────────────────────────────────────────────────────

    const columns: ColumnDef<OrgItem>[] = [
        {
            accessorKey: "name",
            header: "Organization Name",
            size: 300,
            cell: (info) => (
                <span className="text-sm font-semibold leading-snug">
                    {info.getValue<string>()}
                </span>
            ),
        },
        {
            accessorKey: "ein",
            header: "EIN",
            size: 130,
            cell: (info) => (
                <span className="text-sm font-mono text-gray-400">
                    {info.getValue<string>()}
                </span>
            ),
        },
        {
            accessorKey: "city",
            header: "City",
            size: 140,
            cell: (info) => (
                <div className="flex items-center gap-1.5">
                    <IconMapPin size={12} className="text-gray-400" />
                    <span className="text-sm">
                        {info.getValue<string>()}, {info.row.original.state}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "types",
            header: "Types",
            size: 200,
            cell: (info) => {
                const types = info.getValue<string>()?.split(",").map((t) => t.trim()) ?? [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {types.map((t) => (
                            <Chip
                                key={t}
                                size="sm"
                                color={t === "REVOCATION" ? "danger" : t === "EPOSTCARD" ? "primary" : "default"}
                                variant="light"
                                startContent={<IconTag size={8} />}
                            >
                                {t}
                            </Chip>
                        ))}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            size: 120,
            enableSorting: false,
            enableHiding: false,
            cell: (info) => (
                <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    startContent={<IconBuildingCommunity size={13} />}
                    onPress={() => openDrawer(info.row.index)}
                    className="font-semibold"
                >
                    View Details
                </Button>
            ),
        },
    ];

    // ── Table ─────────────────────────────────────────────────────────────────

    const table = useReactTable({
        columns,
        data,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        state: {
            pagination,
        },
        onPaginationChange: handlePaginationChange,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        enableSorting: false,
        enableFilters: false,
    });

    const rows = table.getRowModel().rows;

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div
            className="min-h-screen"
            style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            <div className="px-4 sm:px-8 lg:px-12 py-8" style={{ maxWidth: 1400, margin: "0 auto" }}>
                {/* Page Header */}
                <div className="mb-7">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                borderRadius: 10,
                            }}
                        >
                            <IconBuildingCommunity size={20} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight">
                            Organization Search
                        </h2>
                    </div>
                    <p className="text-sm text-gray-400 ml-[46px]">
                        Search IRS tax-exempt organizations by name
                    </p>
                </div>

                {/* Search Bar */}
                <div
                    className="rounded-xl p-4 mb-5"
                    style={{ border: "1px solid #e8ecf4", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search organization name… (press Enter)"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                            size="lg"
                            classNames={{
                                inputWrapper: "border border-gray-200 rounded-lg font-medium focus-within:border-blue-500",
                            }}
                        />
                        <Button
                            size="lg"
                            radius="lg"
                            onPress={handleSearch}
                            isLoading={loading}
                            isDisabled={!inputValue.trim()}
                            startContent={!loading ? <IconSearch size={15} /> : undefined}
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                fontWeight: 700,
                                paddingInline: 24,
                            }}
                        >
                            Search
                        </Button>
                    </div>
                    {hasSearched && !loading && (
                        <p className="text-xs text-gray-400 mt-2 ml-1">
                            {totalCount > 0
                                ? `${totalCount.toLocaleString()} organizations found for "${query}"`
                                : `No results for "${query}"`}
                        </p>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 mb-4">
                        <p className="text-sm text-red-600 font-medium">
                            ⚠ {error}
                        </p>
                    </div>
                )}

                {/* Table */}
                <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid #e8ecf4", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
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
                            <tbody className="divide-y divide-gray-100">
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
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-4 py-12 text-center text-sm text-gray-500"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                {hasSearched ? (
                                                    <>
                                                        <IconBuildingCommunity size={32} className="text-gray-300" />
                                                        <span>No organizations found</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconSearch size={32} className="text-gray-300" />
                                                        <span>Search for organizations above</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, idx) => (
                                        <tr
                                            key={row.id}
                                            className={`transition-colors hover:bg-gray-50 ${idx % 2 === 1 ? "bg-gray-50/50" : ""}`}
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
                    {hasSearched && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
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
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    isDisabled={!table.getCanPreviousPage()}
                                    onPress={() => table.previousPage()}
                                >
                                    <IconChevronLeft size={16} />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    isDisabled={!table.getCanNextPage()}
                                    onPress={() => table.nextPage()}
                                >
                                    <IconChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Drawer */}
            <DetailDrawer
                isOpen={drawerOpen}
                onClose={closeDrawer}
                ein={selectedOrg?.ein ?? null}
                currentName={selectedOrg?.name ?? ""}
                onPrev={handleDrawerPrev}
                onNext={handleDrawerNext}
                hasPrev={hasPrev}
                hasNext={hasNext}
            />
        </div>
    );
}
