import { Box, Button } from "@chakra-ui/react"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import type { PersonData } from "../../../types/table"

const columnHelper = createColumnHelper<PersonData>()

const columns = [
    columnHelper.accessor("id", {
        header: "ID",
    }),
    columnHelper.accessor("name", {
        header: "Name",
    }),
    columnHelper.accessor("address", {
        header: "Address",
    }),
    columnHelper.accessor("tel", {
        header: "Tel",
    }),
    columnHelper.accessor("job", {
        header: "Job",
    }),
]

const defaultData: PersonData[] = [
    {
        id: 1,
        name: "Jane Smith",
        address: "Osaka",
        tel: "080-1234-5678",
        job: "Designer",
    },
    {
        id: 2,
        name: "John Doe",
        address: "Tokyo",
        tel: "090-1234-5678",
        job: "Engineer",
    },
]

interface Table1Props {
    onSelect: (data: PersonData[]) => void
}

const Table1 = ({ onSelect }: Table1Props) => {
    const [selectedRows, setSelectedRows] = useState<PersonData[]>([])

    const table = useReactTable({
        data: defaultData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleRowClick = (row: PersonData) => {
        setSelectedRows(prev =>
            prev.find(r => r.id === row.id)
                ? prev.filter(r => r.id !== row.id)
                : [...prev, row]
        )
    }

    const handleTransfer = () => {
        onSelect(selectedRows)
        setSelectedRows([])
    }

    return (
        <Box>
            <Box overflowX="auto">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} style={{ padding: "12px", borderBottom: "1px solid gray" }}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => handleRowClick(row.original)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedRows.find(r => r.id === row.original.id)
                                        ? 'rgba(66, 153, 225, 0.1)'
                                        : 'transparent'
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} style={{ padding: "12px", borderBottom: "1px solid lightgray" }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
            <Button
                mt={4}
                colorScheme="blue"
                onClick={handleTransfer}
                isDisabled={selectedRows.length === 0}
            >
                Transfer Selected ({selectedRows.length})
            </Button>
        </Box>
    )
}

export default Table1
