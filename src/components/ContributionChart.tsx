import { For, createEffect, createSignal } from "solid-js";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(dayOfYear);
dayjs.extend(isoWeeksInYear)
dayjs.extend(isoWeek)
dayjs.extend(isLeapYear)
const starts: any = {}
Array.from({length: 12}).map((_, i) => {
  const twoDigit = String(i).length === 1 ? `0${i+1}` : i+1
  starts[i+1] = dayjs(`${new Date().getFullYear()}-${twoDigit}-01`)
})
const twelve = Array.from({length: 12}).map((_, i) => i + 1)

export function ContributionChart (props: {startDate?: string}) { 
  const [count, setCount] = createSignal(0) 
  // const totalWeeks = starts[1].isoWeeksInYear()
  // const end = starts[1].endOf('month')
  const start =  dayjs(`${new Date().getFullYear()}-01-01`)
  const startWeekDay = start.isoWeekday()
  createEffect(() => {
    count()
    console.log(twelve, startWeekDay, starts[1].format('MMM'), starts[1].daysInMonth())
  })
  return (
    <div class="activity-chart" onClick={() => setCount(p => p+1)}>
      <For each={[null, "M", null, "W", null, "F", null]}>
        {(day, i) => <time style={`grid-row-start: ${i()+2}`} class="weekday">{day ?? ''}</time>}
      </For>
      <For each={twelve}>
        {month => (
          <time class="month"
           style={`grid-column: ${(month) * 4 - 2} / span ${month%2 ? 5 : 4};`}>
            {starts[month]?.format('MMM')}
          </time>
        )}
      </For>
      <For each={Array.from({length: startWeekDay})}>
      {(day) => <time class="day placeholder" />}
      </For>
      <For each={twelve}>
        {(m) => <For each={Array.from({length: starts[m]?.daysInMonth()}).map((_, i) => i)}>
          {(day) => {
            const factor = Math.min(255, m**2) - (Math.abs(255/m**2))
            return (
            <time class={`day ${starts[m].format('MMM')}`}
            style={`background-color: rgb(${factor}, ${m%2?factor:100}, ${factor});`}>
              <span class="tooltip">{starts[m].add(day, 'day').format('YY-MM-DD')}</span>
            </time>
          )}}
        </For>}
      </For>
      {/* <For each={Array.from({length: (totalWeeks-5)*7}).map((_, i) => i)}>
        {(day) => {
          return (
          <time class="day">
            <span class="tooltip">{end.format('YY-MM-DD')}</span>
          </time>
        )}}
      </For> */}
    <style>{css}</style>
    </div>
  );
}

const css =`
.activity-chart {
  user-select: none;
  display: grid;
  gap: 1px;
  grid-template-rows: repeat(8, 16px);
  grid-template-columns: repeat(48, 16px);
  grid-auto-flow: column;
}

/*** month headings ** */
.month {
  grid-row: 1 / 1;
  font-size: 0.7em;
}
.weekday {
  font-size: 0.7em;
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
  width: 16px;
  height: 16px;
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
  top: -64px;
  left: -36px;
  width: 100px;
  padding: 10px 5px;
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

/*
  
  // draw months 
  
  var month = moment();
  var outputMonth = "<ol class = 'month'>";
  for (i = 0; i <= 12; i++) {
    var durationMonth = moment.duration({'months' : 1});
    outputMonth += "<li>";
    outputMonth += moment(month).format("MMM");
    outputMonth += "</li>";
    month = moment(month).subtract(durationMonth);
  }
  outputMonth += "</ol>";
  
  var output = "<ol><div class = 'week'>";
  var day = moment();
  
  // Calculate the offset for days of the week to line up correctly
  var dayOfWeekOffset = 6 - (parseInt(moment().format("d"),10));
  for (i = 0; i < (dayOfWeekOffset); i++) { output += "<li class = 'offset'></li>"; }
  
  // draw calendar 
  
  for (i = 365; i >= 0; i--) {
    output += "<li>";
    output += '<span class = "tooltip">' + moment(day).format("MM-DD-YY")  +  '</span>';
    output += "</li>";
    
    var duration = moment.duration({'days' : 1});
    day = moment(day).subtract(duration);
  }
  
  output += "</div></ol>";
  document.getElementById("month").innerHTML = outputMonth;
  document.getElementById("days").innerHTML = output;
  
});

*/