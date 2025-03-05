import { Box, Container, Heading, Text, Button } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback, useEffect } from "react"

import Section1 from "../../components/Playground/Section1/Table"
import Section2 from "../../components/Playground/Section2/Tab"
import Section3 from "../../components/Playground/Section3/Select"
import type { PersonData } from "../../types/table"
import type { FormData, CombinedData } from "../../components/Playground/types/type"

export const Route = createFileRoute("/_layout/playground")({
  component: Playground,
})

function Playground() {
  const [selectedPersons, setSelectedPersons] = useState<PersonData[]>([])
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null)
  const [formData, setFormData] = useState<FormData[]>([])
  const [combinedData, setCombinedData] = useState<CombinedData[]>([])

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

  // Section3でフォームが選択された時の処理
  const handleFormSelect = useCallback((forms: FormData[]) => {
    setSelectedForm(forms[forms.length - 1] || null)
  }, [])

  // Section2で人が選択された時の処理
  const handlePersonSelect = useCallback((persons: PersonData[]) => {
    setSelectedPersons(persons)
  }, [])

  // Transfer Selected ボタンがクリックされた時の処理
  const handleTransfer = useCallback(() => {
    if (!selectedForm) return

    // 新しいCombinedDataを作成
    const newCombinedData: CombinedData = {
      // FormDataのフィールド
      id: selectedForm.id,
      name: selectedForm.name,
      stage: selectedForm.stage,
      status: selectedForm.status,
    }

    // 選択されたPersonDataの情報を追加
    selectedPersons.forEach((person) => {
      if (!newCombinedData.personId) {
        // 最初の人のデータのみを使用
        newCombinedData.personId = person.id
        newCombinedData.address = person.address
        newCombinedData.tel = person.tel
        newCombinedData.job = person.job
      }
    })

    // 既存のデータと結合（重複を避ける）
    const exists = combinedData.some((data) => data.id === newCombinedData.id)
    if (!exists) {
      setCombinedData((prev) => [...prev, newCombinedData])
    }
  }, [selectedForm, selectedPersons, combinedData])

  // Transfer Selectedボタンの無効化条件
  const isTransferDisabled = !selectedForm || selectedPersons.length === 0

  return (
    <Container maxW="full">
      {" "}
      <Heading as="h1" size="lg" mb={4}>
        Playground
      </Heading>
      <Text mb={8}>開発検証用のページです</Text>
      <Box mb={8}>
        <Section3 onSelect={handleFormSelect} currentData={formData} />
      </Box>
      <Box mb={8}>
        <Section2 onSelect={handlePersonSelect} currentData={selectedPersons} />
      </Box>
      <Box mb={4}>
        <Button colorScheme="blue" onClick={handleTransfer} isDisabled={isTransferDisabled} mb={4}>
          Transfer Selected{" "}
          {selectedForm && selectedPersons.length > 0
            ? `(Form: ${selectedForm.name}, Persons: ${selectedPersons.length})`
            : ""}
        </Button>
      </Box>
      <Box mb={8}>
        <Section1 data={combinedData} />
      </Box>
    </Container>
  )
}

export default Playground
