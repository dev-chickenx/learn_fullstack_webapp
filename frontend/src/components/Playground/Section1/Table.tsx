import { Box, Heading } from "@chakra-ui/react"
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

interface TableProps {
  data: PersonData[]
}

const Table = ({ data }: TableProps) => {
  return (
    <Box>
      <Heading size="md" mb={4}>
        Selected Data
      </Heading>
      <DataTable data={data} columns={columns} />
    </Box>
  )
}

export default Table
