import type { Row } from "./MapData/types"
import { Grass } from "./Grass"
import { Roads } from "./Roads"

type Props = {
  rowIndex: number
  rowData: Extract<Row, { type: "road" }>
}

export function Road({ rowIndex, rowData }: Props) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.roads.map((road, index) => (
        <Roads
          key={index}
          tileIndex={road.tileIndex}
          type={road.type}
          rotation={road.rotation}
          offset={road.offset}
          scale={road.scale}
        />
      ))}
    </Grass>
  )
}
