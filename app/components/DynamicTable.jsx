"use client"

import { useState, useMemo } from "react"
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../components/ui/select"
import { Pagination, Stack } from "@mui/material";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";

const EXCLUDED_COLUMNS = ["slNo", "action"]

export default function DynamicTable({
    columns = [],
    data = [],
    rowsPerPage = 10,
    page = 1,
    totalPages = 1,
    onPageSizeChange = () => { },
    onPageChange = () => { },

    // optional controlled search
    showSearch = true,
    searchTerm,
    onSearchChange,
}) {
    const [localSearch, setLocalSearch] = useState("")
    const [sortKey, setSortKey] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")

    // column visibility
    const [visibleColumns, setVisibleColumns] = useState(
        columns.reduce((acc, col) => {
            acc[col.key] = true
            return acc
        }, {})
    )

    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    // decide search source
    const activeSearch = searchTerm !== undefined ? searchTerm : localSearch

    // Filter
    const filteredData = useMemo(() => {
        if (!activeSearch.trim()) return data

        return data.filter((row) =>
            columns.some((col) =>
                String(row[col.key] ?? "")
                    .toLowerCase()
                    .includes(activeSearch.toLowerCase())
            )
        )
    }, [data, activeSearch, columns])

    // Sort
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData

        return [...filteredData].sort((a, b) => {
            const valA = a[sortKey]
            const valB = b[sortKey]
            const emptyA = valA === null || valA === undefined || valA === ""
            const emptyB = valB === null || valB === undefined || valB === ""

            if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1

            let comparison
            if (valA instanceof Date && valB instanceof Date) {
                comparison = valA.getTime() - valB.getTime()
            } else if (
                typeof valA === "number" && typeof valB === "number"
                || typeof valA === "string" && typeof valB === "string"
                    && valA.trim() !== "" && valB.trim() !== ""
                    && Number.isFinite(Number(valA)) && Number.isFinite(Number(valB))
            ) {
                comparison = Number(valA) - Number(valB)
            } else {
                comparison = String(valA).localeCompare(String(valB), undefined, {
                    numeric: true,
                    sensitivity: "base",
                })
            }

            return sortOrder === "asc" ? comparison : -comparison
        })
    }, [filteredData, sortKey, sortOrder])

    const handleSortClick = (key) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        } else {
            setSortKey(key)
            setSortOrder("asc")
        }
    }

    // visible columns list
    const activeColumns = columns.filter((col) => visibleColumns[col.key])

    return (
        <div className="space-y-2">
            {/* Search + Column Toggle */}
            <div className="flex items-center justify-between gap-3 flex-wrap rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex flex-wrap items-center gap-2">
                    {showSearch && (
                        <label className="flex h-9 w-full items-center gap-2 rounded-md border border-gray-300 px-3 focus-within:border-[#2D5F51] sm:w-64">
                            <Search className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search records"
                                aria-label="Search records"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                                value={activeSearch}
                                onChange={(e) => {
                                    if (onSearchChange) {
                                        onSearchChange(e.target.value)
                                    } else {
                                        setLocalSearch(e.target.value)
                                    }
                                }}
                            />
                        </label>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9 cursor-pointer">Columns</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="z-[9999] bg-white shadow-md border rounded-md font-gasalt">

                            {columns
                                .filter((col) => !EXCLUDED_COLUMNS.includes(col.key))
                                .map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.key}
                                        checked={visibleColumns[col.key]}
                                        onCheckedChange={() => toggleColumn(col.key)}
                                    >
                                        {col.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Rows per page */}
                <div className="flex items-center gap-2">
                    <Select
                        value={String(rowsPerPage)}
                        onValueChange={(val) =>
                            onPageSizeChange(parseInt(val))
                        }
                    >
                        <SelectTrigger className="w-[72px] rounded-lg border border-gray-300 bg-white text-sm cursor-pointer">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>

                        <SelectContent className="rounded-lg shadow-lg border border-gray-200 w-[72px] !min-w-[72px] font-gasalt">
                            {[10, 20, 50, 100].map((size) => (
                                <SelectItem key={size} value={String(size)} className="cursor-pointer py-2 text-sm w-[72px] !min-w-[72px]">
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            {/* Table */}
            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <Table className="min-w-full border-separate border-spacing-0">
                    <TableHeader>
                        <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
                            {activeColumns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    aria-sort={sortKey === col.key
                                        ? sortOrder === "asc" ? "ascending" : "descending"
                                        : "none"}
                                    className="h-11 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                                >
                                    {col.sortable === false ? col.label : (
                                        <button
                                            type="button"
                                            onClick={() => handleSortClick(col.key)}
                                            className="inline-flex items-center gap-2 rounded-sm font-bold text-left outline-none hover:text-[#2D5F51] focus-visible:ring-2 focus-visible:ring-[#2D5F51]"
                                            aria-label={`Sort by ${col.label}${sortKey === col.key ? `, currently ${sortOrder === "asc" ? "ascending" : "descending"}` : ""}`}
                                        >
                                            {col.label}
                                            {sortKey === col.key
                                                ? sortOrder === "asc"
                                                    ? <ArrowUp className="h-3.5 w-3.5 cursor-pointer" aria-hidden="true" />
                                                    : <ArrowDown className="h-3.5 w-3.5 cursor-pointer" aria-hidden="true" />
                                                : <ArrowUpDown className="h-3.5 w-3.5 opacity-50 cursor-pointer" aria-hidden="true" />}
                                        </button>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sortedData.length > 0 ? (
                            sortedData.map((row, rowIndex) => (
                                <TableRow key={row._id ?? row.id ?? rowIndex} className="border-b border-gray-100 last:border-0 hover:bg-emerald-50/40">
                                    {activeColumns.map((col, colIndex) => (
                                        <TableCell
                                            key={col.key}
                                            className="px-4 py-3 text-sm text-gray-700"
                                        >
                                            {row[col.key] ?? <span className="text-gray-400">—</span>}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={activeColumns.length}
                                    className="h-24 text-center text-sm text-gray-500"
                                >
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <Stack spacing={1} alignItems="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => onPageChange(value)}
                    size="small"
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                        "& .MuiPagination-ul": {
                            background: "#fff",
                            padding: "3px",
                            borderRadius: "8px",
                            border: "2px solid #2D5F51",
                        },
                        "& .MuiPaginationItem-root": {
                            fontSize: "12px",
                            fontWeight: 600,
                            minWidth: "26px",
                            height: "26px",
                            padding: "0px 4px",
                            borderRadius: "6px",
                            color: "#515156",
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "#2D5F51",
                            color: "#fff",
                            fontWeight: "600",
                            "&:hover": {
                                backgroundColor: "#408370",
                            },
                        },
                        "& .MuiPaginationItem-previousNext": {
                            backgroundColor: "#E6F6FF",
                            color: "#1789C9",
                            borderRadius: "6px",
                            minWidth: "26px",
                            height: "26px",
                            "&:hover": {
                                backgroundColor: "#d9eaff",
                            },
                        },
                        "& .MuiPaginationItem-ellipsis": {
                            fontSize: "12px",
                            opacity: 0.7,
                        },
                    }}
                />
            </Stack>
        </div>
    )
}