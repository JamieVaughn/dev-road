import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { year, month, day, dateOffsets, STARTDATES } from './STARTDATE'
import {
  outline_section_1,
  outline_section_2,
  outline_section_3,
} from './outline'
import { hw_1, hw_2, hw_3 } from './hw'
import { quizzes_1, quizzes_2, quizzes_3 } from './quizzes'
import { projects_1, projects_2, projects_3 } from './projects'

export const stringDates_1 = getClassTimeline(
  `${dateOffsets[0].year}-${dateOffsets[0].month}-${dateOffsets[0].day}`,
  ['9/30/2024', '10/2/2024', '10/3/2024'],
  1
)
export const stringDates_2 = getClassTimeline(`${dateOffsets[1].year}-${dateOffsets[1].month}-${dateOffsets[1].day}`, ['11/25/2024', '11/27/2024', '11/28/2024', '12/23/2024', '12/25/2024', '12/26/2024', '12/30/2024', '1/1/2025', '1/2/2025'], 2)
export const stringDates_3 = getClassTimeline(`${dateOffsets[2].year}-${dateOffsets[2].month}-${dateOffsets[2].day}`, ['2/3/2025', '2/5/2025', '2/6/2025'], 3)

export type TimelineItem = {
  date: string
  hours: number
  hw: string | null
  project: string | null
  quiz: string | null
  outline: string[]
}

export const timeline_1 = sectionFactory().map((i, idx) => ({
  ...i,
  date: stringDates_1[idx],
  outline: outline_section_1[idx],
  quiz: quizzes_1[idx] ?? null,
  hw: hw_1[idx] ?? null,
  project: projects_1[idx] ?? null,
}))

export const timeline_2 = sectionFactory().map((i, idx) => ({
  ...i,
  date: stringDates_2[idx],
  outline: outline_section_2[idx],
  quiz: quizzes_2[idx] ?? null,
  hw: hw_2[idx] ?? null,
  project: projects_2[idx] ?? null,
}))

export const timeline_3 = sectionFactory().map((i, idx) => ({
  ...i,
  date: stringDates_3[idx],
  outline: outline_section_3[idx],
  quiz: quizzes_3[idx] ?? null,
  hw: hw_3[idx] ?? null,
  project: projects_3[idx] ?? null,
}))

/*
@params startDate: string, skipDates: Array<string>, section: number
*/
function getClassTimeline(
  startDate: string = STARTDATES.section1Date.toISOString(),
  skipDates: Array<string>,
  section: number = 1
): string[] {
  // const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let sectionClassDates: Dayjs[] = []
  const startDateObj = new Date(startDate)

  const translateDateObj = (num: number): Dayjs => {
    return dayjs(startDateObj).add(num, 'day')
  }
  const formatDayString = (date: Dayjs) => {
    return date.toISOString().split('T')[0]
  }
  let i = 0
  while (sectionClassDates.length < 20 && i < 27) {
    sectionClassDates.push(translateDateObj(0 + i * 7))
    sectionClassDates.push(translateDateObj(2 + i * 7))
    sectionClassDates.push(translateDateObj(3 + i * 7))
    sectionClassDates = sectionClassDates.filter((day) => {
      return !skipDates.some((skipDate) => dayjs(day).isSame(dayjs(skipDate)))
    })
    i++
  }

  return sectionClassDates.map((date) => formatDayString(date)).slice(0, 20)
}

/*
@params none
*/
function sectionFactory() {
  return Array.from({ length: 20 }).map(() => ({
    date: '',
    hours: 3,
    hw: '',
    project: '',
    quiz: '',
    outline: [],
  }))
}
