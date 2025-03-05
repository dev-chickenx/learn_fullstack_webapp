import { Box, Container, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback, useEffect } from "react"

import Section1 from "../../components/Playground/Section1/Table"
import Section2 from "../../components/Playground/Section2/Tab"
import Section3 from "../../components/Playground/Section3/Select"
import type { PersonData } from "../../types/table"
import type { FormData } from "../../components/Playground/types/type"

export const Route = createFileRoute("/_layout/playground")({
  component: Playground,
})

function Playground() {
  const [selectedData, setSelectedData] = useState<PersonData[]>([])
  const [formData, setFormData] = useState<FormData[]>([])

  const handleDataUpdate = useCallback((newData: PersonData[]) => {
    setSelectedData(newData)
  }, [])

  // フォームデータをフェッチする関数
  const fetchFormData = useCallback(async () => {
    try {
      // 実際のAPIエンドポイントに置き換えてください
      const response = await fetch("/api/formData")
      const data: FormData[] = await response.json()
      setFormData(data)
    } catch (error) {
      console.error("フォームデータの取得に失敗しました:", error)
      // エラー時のフォールバックデータ
      setFormData([
        { id: 1, name: "サンプル1", stage: "ステージ1", status: "進行中" },
        { id: 2, name: "サンプル2", stage: "ステージ2", status: "完了" },
      ])
    }
  }, [])

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchFormData()
  }, [fetchFormData])

  return (
    <Container maxW="full">
      {" "}
      <Heading as="h1" size="lg" mb={4}>
        Playground
      </Heading>
      <Text mb={8}>開発検証用のページです</Text>
      <Box mb={8}>
        <Section3 onSelect={setFormData} currentData={formData} />
      </Box>
      <Box mb={8}>
        <Section2 onSelect={handleDataUpdate} currentData={selectedData} />
      </Box>
      <Box mb={8}>
        <Section1 data={selectedData} />
      </Box>
    </Container>
  )
}

export default Playground
