import { tilesPerRow, tileSize } from "./MapData/constants"

type Props = {
  rowIndex: number
  children?: React.ReactNode
}

export function Grass({ rowIndex, children }: Props) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={"#dedede"} flatShading />
      </mesh>
      {children}
    </group>
  )
}