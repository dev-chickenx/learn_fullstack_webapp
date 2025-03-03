import { Box, Heading, VStack } from "@chakra-ui/react"
import Section1 from "../components/Playground/Section1/Table"
import Section2 from "../components/Playground/Section2/Tab"

const Playground = () => {
    return (
        <VStack spacing={8} align="stretch">
            <Heading size="lg">Playground</Heading>
            <Box>
                <Section1 />
            </Box>
            <Box>
                <Section2 />
            </Box>
        </VStack>
    )
}

export default Playground
