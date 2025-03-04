import { createColumnHelper } from "@tanstack/react-table"
import DataTable from "../../Common/DataTable"
import type { PersonData } from "../../../types/table"

const columnHelper = createColumnHelper<PersonData>()

const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("address", { header: "Address" }),
    columnHelper.accessor("tel", { header: "Tel" }),
    columnHelper.accessor("job", { header: "Job" }),
]

interface Table2Props {
    onSelect: (data: PersonData[]) => void
    selectedRows: PersonData[]
    data: PersonData[]
}

const Table2 = ({ onSelect, selectedRows, data }: Table2Props) => {
    console.log("Table2 Rendered")
    return (
        <DataTable
            data={data}
            columns={columns}
            onSelect={onSelect}
            selectedRows={selectedRows}
        />
    )
}

export default Table2
