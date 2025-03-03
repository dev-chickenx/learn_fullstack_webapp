import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Table1 from "./Table1"
import Table2 from "./Table2"
import type { PersonData } from "../types/table"

interface TabComponentProps {
    onSelect: (data: PersonData[]) => void
}

const TabComponent = ({ onSelect }: TabComponentProps) => {
    return (
        <Box>
            <Heading size="md">Section 2</Heading>
            <Tabs>
                <TabList>
                    <Tab>Table 1</Tab>
                    <Tab>Table 2</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Table1 onSelect={onSelect} />
                    </TabPanel>
                    <TabPanel>
                        <Table2 onSelect={onSelect} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default TabComponent
