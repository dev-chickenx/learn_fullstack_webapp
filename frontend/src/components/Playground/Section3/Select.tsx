import { Box, Heading, Select } from "@chakra-ui/react"
import type { FormData } from "../types/type"
interface Section3Props {
  onSelect: (data: FormData[]) => void
  currentData: FormData[]
}

const Section3 = ({ onSelect, currentData }: Section3Props) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value)
    const selectedForm = currentData.find((form) => form.id === selectedId)

    if (selectedForm) {
      // 現在のデータと新しい選択を結合し、重複を除去
      const combinedData = [...currentData, selectedForm]
      const uniqueSelections = combinedData.reduce((acc, current) => {
        const exists = acc.find((item) => item.id === current.id)
        if (!exists) {
          acc.push(current)
        }
        return acc
      }, [] as FormData[])

      onSelect(uniqueSelections)
    }
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Section 3
      </Heading>
      <Select placeholder="Select form" onChange={handleSelectChange} mb={4}>
        {currentData.map((form) => (
          <option key={form.id} value={form.id}>
            {form.name} ({form.stage} - {form.status})
          </option>
        ))}
      </Select>
    </Box>
  )
}

export default Section3
