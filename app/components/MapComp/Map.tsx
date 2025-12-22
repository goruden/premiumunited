import { rows } from "./MapData/metadata"
import { Row } from "./Row"

export function Map() {
  return (
    <>
      {rows.map((rowData, index) => {
        const rowIndex = index - 10
        return <Row key={index} rowIndex={rowIndex} rowData={rowData} />
      })}
    </>
  )
}
