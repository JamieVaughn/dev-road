import { For } from 'solid-js'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(dayOfYear)
dayjs.extend(isoWeeksInYear)
dayjs.extend(isoWeek)
dayjs.extend(isLeapYear)
const starts: any = {}
Array.from({ length: 12 }).map((_, i) => {
  const twoDigit = String(i).length === 1 ? `0${i + 1}` : i + 1
  starts[i + 1] = dayjs(`${new Date().getFullYear()}-${twoDigit}-01`)
})
const twelveMonths = Array.from({ length: 12 }).map((_, i) => i + 1)

export function ContributionChart(props: { startDate?: string }) {
  const year = new Date().getFullYear()
  const start = dayjs(`${year}-01-01`)
  const startWeekDay = start.isoWeekday()

  return (
    <div class='activity-chart'>
      <time class='year'>{year}</time>
      <For each={[null, 'M', null, 'W', null, 'F', null]}>
        {(day, i) => (
          <time style={`grid-row-start: ${i() + 2}`} class='weekday'>
            {day ?? ''}
          </time>
        )}
      </For>
      <For each={twelveMonths}>
        {(month) => {
          const offset =
            month === 7 ? 3 : 5 - (31 - starts[month].daysInMonth())
          return (
            <time class='month' style={`grid-column-end: span ${offset};`}>
              {starts[month]?.format('MMM')}
            </time>
          )
        }}
      </For>
      <For each={Array.from({ length: startWeekDay })}>
        {(_) => (
          <time
            class='day placeholder'
            style='background-color: transparent;'
          />
        )}
      </For>
      <For each={twelveMonths}>
        {(m) => (
          <For
            each={Array.from({ length: starts[m].daysInMonth() }).map(
              (_, i) => i
            )}
          >
            {(day) => {
              return (
                <time
                  class={`day`}
                  style={`background-color: ${m % 2 ? '#ddd' : '#f1f1f1'};`}
                >
                  <span class='tooltip'>
                    {starts[m].add(day, 'day').format('YY-MM-DD')}
                  </span>
                </time>
              )
            }}
          </For>
        )}
      </For>
      <style>{css}</style>
    </div>
  )
}

const css = `
.activity-chart {
  --grid-cell: 12px;
  user-select: none;
  display: grid;
  gap: 1px;
  grid-template-rows: repeat(8, var(--grid-cell));
  grid-template-columns: repeat(52, var(--grid-cell));
  grid-auto-flow: column dense; 
  max-width: fit-content;
  margin: 0 auto;
}
.year {
  font-size: 0.5em;
  grid-column: 1 / span 2;
}
/*** month headings ** */

.month {
  font-size: 0.7em;
  justify-self: center;
  align-self: center;
  grid-row: 1 / 1;
  grid-column-start: auto;
}
.weekday {
  font-size: 0.7em;
  justify-self: center;
  align-self: center;
}

.activity-chart .offset {
  background: none;
}
.activity-chart .offset:hover {
  outline: none;
}


time.day:first-of-type {
  grid-row-start: 2;
}
time.day {
  width: var(--grid-cell);
  height: var(--grid-cell);
}
time.day.placeholder {
  background: white;
}
time.day,
[data-activity="0"] {
  background: #eee;
}

.activity-chart [data-activity="1"] {
  background: #d6e685;
}
.activity-chart [data-activity="2"] {
  background: #8cc665;
}
.activity-chart [data-activity="3"] {
  background: #44a340;
}
.activity-chart [data-activity="4"] {
  background: #1e6823;
}

/*** tooltips ** */
time.day .tooltip {
  display: none;
}
time.day:hover {
  position: relative;
  z-index: 3;
}
time.day:hover .tooltip {
  display: block;
  position: absolute;
  /* top & left are reversed because the calendar is rotated 90 deg */
  top: -46px;
  left: -38px;
  width: 100px;
  padding: 0 5px;
  text-align: center;
  background-color: #333;
  color: #f1f1f1;
}

/*** little triangle on the tooltip ** */
.tooltip:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  bottom: -10px;
  right: 50px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 11px solid #333;
}`
