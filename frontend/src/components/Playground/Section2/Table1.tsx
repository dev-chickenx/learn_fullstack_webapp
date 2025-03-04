import { Box } from "@chakra-ui/react"
import { createColumnHelper } from "@tanstack/react-table"
import DataTable from "../../Common/DataTable"
import type { PersonData } from "../../../types/table"
import { useState } from "react"

const columnHelper = createColumnHelper<PersonData>()

const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("address", { header: "Address" }),
    columnHelper.accessor("tel", { header: "Tel" }),
    columnHelper.accessor("job", { header: "Job" }),
]

interface Table1Props {
    onSelect: (data: PersonData[]) => void
    selectedRows: PersonData[]
    data: PersonData[]
}

const Table1 = ({ onSelect, selectedRows, data }: Table1Props) => {
    return (
        <DataTable
            data={data}
            columns={columns}
            onSelect={onSelect}
            selectedRows={selectedRows}
        />
    )
}

export default Table1
