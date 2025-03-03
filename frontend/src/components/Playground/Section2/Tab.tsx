import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Table1 from "./Table1"
import Table2 from "./Table2"

const TabComponent = () => {
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
                        <Table1 />
                    </TabPanel>
                    <TabPanel>
                        <Table2 />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default TabComponent
