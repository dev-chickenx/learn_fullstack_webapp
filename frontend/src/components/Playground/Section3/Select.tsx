import { Box, Heading, Select } from "@chakra-ui/react"
import type { PersonData } from "../../../types/table"

interface Section3Props {
    onSelect: (data: PersonData[]) => void
    currentData: PersonData[]
}

const Section3 = ({ onSelect, currentData }: Section3Props) => {
    // 選択肢のデータ
    const options: PersonData[] = [
        {
            id: 5,
            name: "Charlie Wilson",
            address: "Sapporo",
            tel: "050-1234-5678",
            job: "Developer",
        },
        {
            id: 6,
            name: "Diana Clark",
            address: "Fukuoka",
            tel: "040-1234-5678",
            job: "Manager",
        },
    ]

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value)
        const selectedPerson = options.find(person => person.id === selectedId)

        if (selectedPerson) {
            // 現在のデータと新しい選択を結合し、重複を除去
            const combinedData = [...currentData, selectedPerson]
            const uniqueSelections = combinedData.reduce((acc, current) => {
                const exists = acc.find(item => item.id === current.id)
                if (!exists) {
                    acc.push(current)
                }
                return acc
            }, [] as PersonData[])

            onSelect(uniqueSelections)
        }
    }

    return (
        <Box>
            <Heading size="md" mb={4}>Section 3</Heading>
            <Select
                placeholder="Select person"
                onChange={handleSelectChange}
                mb={4}
            >
                {options.map(person => (
                    <option key={person.id} value={person.id}>
                        {person.name} ({person.job})
                    </option>
                ))}
            </Select>
        </Box>
    )
}

export default Section3
