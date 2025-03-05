import { useState, memo } from "react"
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Table1 from "./Table1"
import Table2 from "./Table2"
import type { PersonData } from "../../../types/table"

interface Section2Props {
  onSelect: (data: PersonData[]) => void
  currentData: PersonData[]
}

const Section2 = memo(({ onSelect, currentData }: Section2Props) => {
  console.log("Section2 Render", { currentData }) // レンダリングの追跡

  // テーブルのデータを管理
  const table1Data: PersonData[] = [
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

  const table2Data: PersonData[] = [
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

  const [table1Selection, setTable1Selection] = useState<PersonData[]>([])
  const [table2Selection, setTable2Selection] = useState<PersonData[]>([])

  const handleTableSelection = (tableData: PersonData[], isTable1: boolean) => {
    if (isTable1) {
      setTable1Selection(tableData)
    } else {
      setTable2Selection(tableData)
    }
    // 両方のテーブルの選択を親コンポーネントに通知
    const allSelections = isTable1
      ? [...tableData, ...table2Selection]
      : [...table1Selection, ...tableData]
    onSelect(allSelections)
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Section 2
      </Heading>
      <Box>
        <Tabs>
          <TabList>
            <Tab>Table 1 ({table1Selection.length})</Tab>
            <Tab>Table 2 ({table2Selection.length})</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Table1
                data={table1Data}
                onSelect={(data) => handleTableSelection(data, true)}
                selectedRows={table1Selection}
              />
            </TabPanel>
            <TabPanel>
              <Table2
                data={table2Data}
                onSelect={(data) => handleTableSelection(data, false)}
                selectedRows={table2Selection}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
})

export default Section2
