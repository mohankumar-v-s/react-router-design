// app/routes/organizationSearch.tsx
// React Router v7 Framework Mode Route

import { useState, useCallback, useRef } from "react";
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_PaginationState,
} from "mantine-react-table";
import {
    TextInput,
    Button,
    Group,
    Badge,
    Stack,
    Text,
    Paper,
    ActionIcon,
    Tooltip,
    Box,
    Divider,
    Loader,
    Center,
    Title,
} from "@mantine/core";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    Button as HeroButton,
} from "@heroui/react";
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

    const DetailRow = ({
        label,
        value,
    }: {
        label: string;
        value?: string | null;
    }) => {
        if (!value) return null;
        return (
            <Group 
            // justify="space-between" 
            py={6} style={{ borderBottom: "1px solid var(--mantine-color-gray-1)" }}>
                <Text size="xs" c="dimmed" fw={600} style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                </Text>
                <Text size="sm" fw={500} ta="right" style={{ maxWidth: "60%" }}>
                    {value}
                </Text>
            </Group>
        );
    };

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
                    <Group 
                    // justify="space-between" 
                    align="flex-start">
                        <Stack 
                        // gap={2} 
                        style={{ flex: 1, minWidth: 0 }}>
                            <Text
                                size="xs"
                                c="dimmed"
                                fw={700}
                                style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                            >
                                Organization Details
                            </Text>
                            <Text
                                fw={700}
                                size="md"
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
                            </Text>
                            {ein && (
                                <Badge
                                    color="blue"
                                    variant="light"
                                    size="sm"
                                    leftSection={<IconId size={10} />}
                                >
                                    EIN: {ein}
                                </Badge>
                            )}
                        </Stack>
                        <ActionIcon variant="subtle" color="gray" onClick={onClose} size="sm">
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>

                    {/* Prev / Next */}
                    <Group mt={10} 
                    // gap={8}
                    >
                        <Tooltip label="Previous organization">
                            <ActionIcon
                                variant="default"
                                disabled={!hasPrev}
                                onClick={onPrev}
                                size="sm"
                            >
                                <IconChevronLeft size={14} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Next organization">
                            <ActionIcon
                                variant="default"
                                disabled={!hasNext}
                                onClick={onNext}
                                size="sm"
                            >
                                <IconChevronRight size={14} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </DrawerHeader>

                {/* Body */}
                <DrawerBody>
                    <Box px={20} py={16}>
                        {loading && (
                            <Center h={200}>
                                <Stack align="center">
                                    <Loader size="sm" color="blue" />
                                    <Text size="xs" c="dimmed">Loading details…</Text>
                                </Stack>
                            </Center>
                        )}

                        {error && (
                            <Paper p="md" radius="md" bg="red.0" withBorder>
                                <Text size="sm" c="red.7">
                                    Failed to load: {error}
                                </Text>
                            </Paper>
                        )}

                        {detail && !loading && (
                            <Stack>
                                {/* Identity */}
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="blue.6"
                                    mb={6}
                                    style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                                >
                                    Identity
                                </Text>
                                <DetailRow label="Legal Name" value={detail.legalName} />
                                <DetailRow label="DBA Name" value={detail.dbaName} />
                                <DetailRow label="Sort Name" value={detail.sortName} />
                                <DetailRow label="EIN" value={detail.ein} />

                                <Divider my={14} />

                                {/* Location */}
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="blue.6"
                                    mb={6}
                                    style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                                >
                                    Location
                                </Text>
                                <DetailRow label="City" value={detail.city} />
                                <DetailRow label="State" value={detail.state} />
                                <DetailRow label="Country" value={detail.country} />

                                <Divider my={14} />

                                {/* Classification */}
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="blue.6"
                                    mb={6}
                                    style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                                >
                                    Classification
                                </Text>
                                <DetailRow label="Subsection" value={detail.subsection} />
                                <DetailRow label="Classification" value={detail.classification} />
                                <DetailRow label="Foundation" value={detail.foundation} />
                                <DetailRow label="Deductibility" value={detail.deductibility} />
                                <DetailRow label="Status" value={detail.status} />
                                <DetailRow label="NTEE Code" value={detail.nteecc} />
                                <DetailRow label="Activity" value={detail.activity} />
                                <DetailRow label="Organization" value={detail.organization} />

                                <Divider my={14} />

                                {/* Financials */}
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="blue.6"
                                    mb={6}
                                    style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                                >
                                    Financials
                                </Text>
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
                            </Stack>
                        )}
                    </Box>
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
    const [pagination, setPagination] = useState<MRT_PaginationState>({
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
        updater: MRT_PaginationState | ((prev: MRT_PaginationState) => MRT_PaginationState)
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

    const columns: MRT_ColumnDef<OrgItem>[] = [
        {
            accessorKey: "name",
            header: "Organization Name",
            size: 300,
            Cell: ({ cell }) => (
                <Text fw={600} size="sm" style={{ lineHeight: 1.4 }}>
                    {cell.getValue<string>()}
                </Text>
            ),
        },
        {
            accessorKey: "ein",
            header: "EIN",
            size: 130,
            Cell: ({ cell }) => (
                <Text size="sm" ff="monospace" c="dimmed">
                    {cell.getValue<string>()}
                </Text>
            ),
        },
        {
            accessorKey: "city",
            header: "City",
            size: 140,
            Cell: ({ cell, row }) => (
                <Group>
                    <IconMapPin size={12} color="gray" />
                    <Text size="sm">
                        {cell.getValue<string>()}, {row.original.state}
                    </Text>
                </Group>
            ),
        },
        {
            accessorKey: "types",
            header: "Types",
            size: 200,
            Cell: ({ cell }) => {
                const types = cell.getValue<string>()?.split(",").map((t) => t.trim()) ?? [];
                return (
                    <Group>
                        {types.map((t) => (
                            <Badge
                                key={t}
                                size="xs"
                                variant="light"
                                color={t === "REVOCATION" ? "red" : t === "EPOSTCARD" ? "blue" : "gray"}
                                leftSection={<IconTag size={8} />}
                            >
                                {t}
                            </Badge>
                        ))}
                    </Group>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            size: 120,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({ row }) => (
                <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    leftSection={<IconBuildingCommunity size={13} />}
                    onClick={() => openDrawer(row.index)}
                    style={{ fontWeight: 600 }}
                >
                    View Details
                </Button>
            ),
        },
    ];

    // ── Table ─────────────────────────────────────────────────────────────────

    const table = useMantineReactTable({
        columns,
        data,
        rowCount: totalCount,
        state: {
            pagination,
            isLoading: loading,
            showAlertBanner: !!error,
        },
        manualPagination: true,
        onPaginationChange: handlePaginationChange,
        enableGlobalFilter: false,
        enableColumnFilters: false,
        enableSorting: false,
        enableTopToolbar: false,
        enableBottomToolbar: true,
        paginationDisplayMode: "pages",
        mantinePaginationProps: {
            rowsPerPageOptions: ["10", "25", "50"],
            showRowsPerPage: true,
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            // withTableBorder: false,
            withColumnBorders: false,
        },
        mantineTableBodyRowProps: {
            style: { cursor: "default" },
        },
        renderEmptyRowsFallback: () => (
            <Center h={200}>
                {hasSearched ? (
                    <Stack align="center">
                        <IconBuildingCommunity size={32} color="gray" />
                        <Text c="dimmed" size="sm">No organizations found</Text>
                    </Stack>
                ) : (
                    <Stack align="center">
                        <IconSearch size={32} color="gray" />
                        <Text c="dimmed" size="sm">Search for organizations above</Text>
                    </Stack>
                )}
            </Center>
        ),
    });

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Box
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            <Box
                px={{ base: 16, sm: 32, lg: 48 }}
                py={32}
                style={{ maxWidth: 1400, margin: "0 auto" }}
            >
                {/* Page Header */}
                <Stack mb={28}>
                    <Group>
                        <Box
                            p={8}
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <IconBuildingCommunity size={20} color="white" />
                        </Box>
                        <Title order={2} fw={800} style={{ letterSpacing: "-0.02em" }}>
                            Organization Search
                        </Title>
                    </Group>
                    <Text c="dimmed" size="sm" ml={46}>
                        Search IRS tax-exempt organizations by name
                    </Text>
                </Stack>

                {/* Search Bar */}
                <Paper
                    shadow="xs"
                    radius="lg"
                    p="md"
                    mb={20}
                    style={{ border: "1px solid #e8ecf4" }}
                >
                    <Group>
                        <TextInput
                            placeholder="Search organization name… (press Enter)"
                            // leftSection={<IconSearch size={16} color="#94a3b8" />}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.currentTarget.value)}
                            onKeyDown={handleKeyDown}
                            style={{ flex: 1 }}
                            size="md"
                            radius="md"
                            styles={{
                                input: {
                                    border: "1.5px solid #e2e8f0",
                                    fontWeight: 500,
                                    "&:focus": { borderColor: "#3b82f6" },
                                },
                            }}
                        />
                        <Button
                            size="md"
                            radius="md"
                            onClick={handleSearch}
                            loading={loading}
                            disabled={!inputValue.trim()}
                            leftSection={<IconSearch size={15} />}
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                fontWeight: 700,
                                paddingInline: 24,
                            }}
                        >
                            Search
                        </Button>
                    </Group>
                    {hasSearched && !loading && (
                        <Text size="xs" c="dimmed" mt={8} ml={4}>
                            {totalCount > 0
                                ? `${totalCount.toLocaleString()} organizations found for "${query}"`
                                : `No results for "${query}"`}
                        </Text>
                    )}
                </Paper>

                {/* Error */}
                {error && (
                    <Paper p="md" radius="md" mb={16} bg="red.0" withBorder>
                        <Text size="sm" c="red.7" fw={500}>
                            ⚠ {error}
                        </Text>
                    </Paper>
                )}

                {/* Table */}
                <Paper
                    shadow="xs"
                    radius="lg"
                    style={{ border: "1px solid #e8ecf4", overflow: "hidden" }}
                >
                    <MantineReactTable table={table} />
                </Paper>
            </Box>

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
        </Box>
    );
}