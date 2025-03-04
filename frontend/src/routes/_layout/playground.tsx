import { Box, Container, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback } from "react"

import Section1 from "../../components/Playground/Section1/Table"
import Section2 from "../../components/Playground/Section2/Tab"
import Section3 from "../../components/Playground/Section3/Select"
import type { PersonData } from "../../types/table"

export const Route = createFileRoute("/_layout/playground")({
  component: Playground,
})

function Playground() {
  const [selectedData, setSelectedData] = useState<PersonData[]>([])

  const handleDataUpdate = useCallback((newData: PersonData[]) => {
    setSelectedData(newData)
  }, [])

  return (
    <Container maxW="full">
      <Heading as="h1" size="lg" mb={4}>
        Playground
      </Heading>
      <Text mb={8}>開発検証用のページです</Text>

      <Box mb={8}>
        <Section1 data={selectedData} />
      </Box>

      <Box mb={8}>
        <Section2
          onSelect={handleDataUpdate}
          currentData={selectedData}
        />
      </Box>

      <Box mb={8}>
        <Section3
          onSelect={setSelectedData}
          currentData={selectedData}
        />
      </Box>
    </Container>
  )
}

export default Playground
