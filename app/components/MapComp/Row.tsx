import type { Row as RowType } from "./MapData/types"
import { Road } from "./Road"

type Props = {
  rowIndex: number
  rowData: RowType
}

export function Row({ rowIndex, rowData }: Props) {
  switch (rowData.type) {
    case "road":
      return <Road rowIndex={rowIndex} rowData={rowData} />
    default:
      return null
  }
}
