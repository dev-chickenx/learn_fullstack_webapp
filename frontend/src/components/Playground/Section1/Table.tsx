import { Box, Heading } from "@chakra-ui/react"
import { createColumnHelper } from "@tanstack/react-table"
import DataTable from "../../Common/DataTable"
import type { CombinedData } from "../types/type"

const columnHelper = createColumnHelper<CombinedData>()

const columns = [
  // FormDataのカラム
  columnHelper.accessor("id", { header: "Form ID" }),
  columnHelper.accessor("name", { header: "Form Name" }),
  columnHelper.accessor("stage", { header: "Stage" }),
  columnHelper.accessor("status", { header: "Status" }),
  // PersonDataのカラム
  columnHelper.accessor("personId", {
    header: "Person ID",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("tel", {
    header: "Tel",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("job", {
    header: "Job",
    cell: (info) => info.getValue() || "-",
  }),
]

interface TableProps {
  data: CombinedData[]
}

const Table = ({ data }: TableProps) => {
  return (
    <Box>
      <Heading size="md" mb={4}>
        Combined Form and Person Data
      </Heading>
      <DataTable data={data} columns={columns} />
    </Box>
  )
}

export default Table
