export interface FloorPlan {
  id: string
  restaurantId: string
  name: string
  width: number
  height: number
  gridSize: number
  elements: FloorPlanElement[]
  createdAt: string
  updatedAt: string
}

export interface FloorPlanElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  properties: ElementProperties
}

export type ElementType = 'TABLE' | 'CHAIR' | 'WALL' | 'BAR' | 'KITCHEN' | 'DOOR' | 'WINDOW'

export interface ElementProperties {
  // Table properties
  name?: string
  capacity?: number
  shape?: 'ROUND' | 'SQUARE' | 'RECTANGLE'
  specialPrice?: number
  promotion?: number
  isVip?: boolean

  // Wall properties
  color?: string

  // Common properties
  label?: string
}

export interface Table extends FloorPlanElement {
  type: 'TABLE'
  properties: TableProperties
}

export interface TableProperties extends ElementProperties {
  name: string
  capacity: number
  shape: 'ROUND' | 'SQUARE' | 'RECTANGLE'
  specialPrice?: number
  promotion?: number
  isVip: boolean
}
