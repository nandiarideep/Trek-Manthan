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

const EXCLUDED_COLUMNS = ["slNo", "action"]

export default function DynamicTable({
    columns = [],
    data = [],
    rowsPerPage = 10,
    page = 1,
    totalPages = 1,
    onPageSizeChange = () => { },

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

    // 🔍 Filter
    const filteredData = useMemo(() => {
        return data.filter((row) =>
            columns.some((col) =>
                String(row[col.key] ?? "")
                    .toLowerCase()
                    .includes(activeSearch.toLowerCase())
            )
        )
    }, [data, activeSearch, columns])

    // 🔃 Sort
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData

        return [...filteredData].sort((a, b) => {
            const valA = a[sortKey]
            const valB = b[sortKey]

            if (valA < valB) return sortOrder === "asc" ? -1 : 1
            if (valA > valB) return sortOrder === "asc" ? 1 : -1
            return 0
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
            {/* 🔍 Search + Column Toggle */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2">
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border rounded-md px-3 py-[7px] focus:border-[#2D5F51] w-64 text-sm font-semibold duration-200"
                            value={activeSearch}
                            onChange={(e) => {
                                if (onSearchChange) {
                                    onSearchChange(e.target.value)
                                } else {
                                    setLocalSearch(e.target.value)
                                }
                            }}
                        />
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Columns</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="z-[9999] bg-white shadow-md border rounded-md">

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

                        <SelectContent className="rounded-lg shadow-lg border border-gray-200 w-[72px] !min-w-[72px]">
                            {[10, 20, 50, 100].map((size) => (
                                <SelectItem key={size} value={String(size)} className="cursor-pointer py-2 text-sm w-[72px] !min-w-[72px]">
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            {/* 📊 Table */}
            <div className="overflow-x-auto rounded-lg w-full">
                <style>{`tbody tr { border: 1px solid #2D5F51; }`}</style>
                <Table className="min-w-full border-seperate border-spacing-0">
                    <TableHeader className="">
                        <TableRow className="bg-[#2D5F51]">
                            {activeColumns.map((col, colIndex) => (
                                <TableHead
                                    key={col.key}
                                    onClick={() => handleSortClick(col.key)}
                                    style={{
                                        position: "sticky",
                                        left: 0,
                                        zIndex: 30,
                                        borderRadius: colIndex === 0 ? "8px 0 0 8px" : colIndex === activeColumns.length - 1 ? "0 8px 8px 0" : undefined
                                    }}
                                >
                                    <div
                                        className="p-2 text-center text-white font-semibold cursor-pointer select-none"
                                    >
                                        {col.label}
                                        {sortKey === col.key && (
                                            <span className="ml-1">
                                                {sortOrder === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sortedData.length > 0 ? (
                            sortedData.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="text-center">
                                    {activeColumns.map((col, colIndex) => (
                                        <TableCell
                                            key={col.key}
                                            className={`p-2 text-center border border-[#2D5F51]
                        
                                            ${colIndex === 0 ? "rounded-l-lg" : ""}
                                            ${colIndex === activeColumns.length - 1 ? "rounded-r-lg" : ""}
                                            
                                            ${rowIndex === 0 ? "border-t" : ""}
                                            ${rowIndex === sortedData.length - 1 ? "border-b" : ""}
                                            `}
                                        >
                                            {row[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={activeColumns.length}
                                    className="text-center"
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
                    onChange={(e, value) => onPageChange(value)}
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