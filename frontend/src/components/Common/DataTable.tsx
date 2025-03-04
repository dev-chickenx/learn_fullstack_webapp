import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table"
import { useState } from "react"
import type { PersonData } from "../../types/table"

interface DataTableProps<T> {
    data: T[]
    columns: ColumnDef<T, any>[]
    onSelect: (data: T[]) => void
    showTransferButton?: boolean
    selectedRows?: T[]
}

const DataTable = ({ data, columns, onSelect, showTransferButton = false, selectedRows = [] }: DataTableProps<PersonData>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleRowClick = (row: PersonData) => {
        if (!onSelect) return
        const newSelection = selectedRows.find(r => r.id === row.id)
            ? selectedRows.filter(r => r.id !== row.id)
            : [...selectedRows, row]
        onSelect(newSelection)
    }

    const handleTransfer = () => {
        if (onSelect) {
            onSelect(selectedRows)
        }
    }

    return (
        <Box>
            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr
                                key={row.id}
                                onClick={() => handleRowClick(row.original)}
                                cursor={onSelect ? "pointer" : "default"}
                                bg={selectedRows.find(r => r.id === row.original.id)
                                    ? "blue.50"
                                    : "transparent"}
                                _hover={onSelect ? { bg: "gray.50" } : undefined}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {showTransferButton && (
                <Button
                    mt={4}
                    colorScheme="blue"
                    onClick={handleTransfer}
                    isDisabled={selectedRows.length === 0}
                >
                    Transfer Selected ({selectedRows.length})
                </Button>
            )}
        </Box>
    )
}

export default DataTable
