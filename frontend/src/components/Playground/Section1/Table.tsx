import { Box, Heading } from "@chakra-ui/react"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
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

interface TableProps {
    data: PersonData[]
}

const Table = ({ data }: TableProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Box>
            <Heading size="md" mb={4}>Selected Data</Heading>
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
                            <tr key={row.id}>
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
        </Box>
    )
}

export default Table
