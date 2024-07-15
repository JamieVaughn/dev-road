export const year = 2024
export const month = 9
export const day = 2
const hour = 18.5

export const dateOffsets = [
  {
    year: 2024,
    month: 9,
    day:2 
  },
  {
    year: 2024,
    month: 11,
    day: 4
  },
  {
    year: 2025,
    month: 1,
    day: 13
  }
]

const section1Date = new Date(year, month - 1, day, hour)
const section2Date = new Date(year, 10 - 1, day, hour)
const section3Date = new Date(year, 11 - 1, day, hour)

export const STARTDATES = {
  section1Date,
  section2Date,
  section3Date,
}

