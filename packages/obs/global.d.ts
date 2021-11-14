export type CssObject = {
  [key: string]: string | number | ((val: number | string) => string | number)
}
export type PositionConfig = [0 | 1, 0 | 1 | 0.5]
