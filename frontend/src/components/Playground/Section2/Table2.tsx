import { Box } from "@chakra-ui/react"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import type { PersonData } from "../../../types/table"

const columnHelper = createColumnHelper<PersonData>()

const columns = [
    columnHelper.accessor("tel", {
        header: "Tel",
    }),
    columnHelper.accessor("job", {
        header: "Job",
    }),
]

const defaultData: PersonData[] = [
    {
        id: 3,
        name: "Bob Johnson",
        address: "Kyoto",
        tel: "070-1234-5678",
        job: "Manager",
    },
    {
        id: 4,
        name: "Alice Brown",
        address: "Nagoya",
        tel: "060-1234-5678",
        job: "Designer",
    },
]

const Table2 = () => {
    const table = useReactTable({
        data: defaultData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
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
    )
}

export default Table2
