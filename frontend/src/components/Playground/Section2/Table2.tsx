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

interface Table2Props {
    onSelect: (data: PersonData[]) => void
}

const Table2 = ({ onSelect }: Table2Props) => {
    return (
        <DataTable
            data={defaultData}
            columns={columns}
            onSelect={onSelect}
            showTransferButton
        />
    )
}

export default Table2
