import type { PersonData } from "../../../types/table"

export interface FormData {
  id: number
  name: string
  stage: string
  status: string
}

// FormDataとPersonDataを結合したインターフェース
export interface CombinedData {
  // FormDataのフィールド
  id: number
  name: string
  stage: string
  status: string
  // PersonDataのフィールド
  personId?: number // 紐付いたPersonのID
  address?: string
  tel?: string
  job?: string
}
