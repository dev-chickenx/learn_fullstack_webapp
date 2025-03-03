import { Box } from "@chakra-ui/react"
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
    return (
        <DataTable
            data={defaultData}
            columns={columns}
            onSelect={onSelect}
            showTransferButton
        />
    )
}

export default Table1
