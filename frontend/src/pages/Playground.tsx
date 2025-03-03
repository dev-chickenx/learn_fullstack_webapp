import { Box, Heading, VStack } from "@chakra-ui/react"
import { useState } from "react"
import Section1 from "../components/Playground/Section1/Table"
import Section2 from "../components/Playground/Section2/Tab"
import type { PersonData } from "../types/table"

const Playground = () => {
    const [selectedData, setSelectedData] = useState<PersonData[]>([])

    return (
        <VStack spacing={8} align="stretch">
            <Heading size="lg">Playground</Heading>
            <Box>
                <Section1 data={selectedData} />
            </Box>
            <Box>
                <Section2 onSelect={setSelectedData} />
            </Box>
        </VStack>
    )
}

export default Playground
