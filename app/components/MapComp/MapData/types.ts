import * as THREE from "three"

export type RowType = "car" | "road" | "truck"

export type RoadTile = {
  tileIndex: number
  type: string
  dir?: string // add this
  rotation?: [number, number, number]
  offset?: [number, number, number]
  scale?: [number, number, number]
}

export type Row =
  | {
      type: "car"
      direction: boolean
      speed: number
      vehicles: {
        initialTileIndex: number
        color: THREE.ColorRepresentation
      }[]
    }
  | {
      type: "road"
      roads: RoadTile[]
    }
  | {
      type: "truck"
      direction: boolean
      speed: number
      vehicles: {
        initialTileIndex: number
        color: THREE.ColorRepresentation
      }[]
    }