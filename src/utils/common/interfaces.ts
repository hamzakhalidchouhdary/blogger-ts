import { NumberOrNull } from "./types"

export interface UserDetails {
  id: NumberOrNull,
  firstName: string,
  lastName: string,
  username: string,
  role: string
}

export interface Error {
  message: string,
  status: number
}