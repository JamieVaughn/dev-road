import { For, createEffect } from "solid-js";
import { createSignal } from "solid-js";
import dayjs, { type Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const createMonthDays = (year: number, month: number, num: number) =>
  [...Array(num)].map((_day, index) => {
    return {
      date: dayjs(`${year}-${month + 1}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: true,
      weekday: getWeekday(`${year}-${month + 1}-${index + 1}`),
    };
  });

const createDaysForPreviousMonth = (
  year: number,
  month: number,
  firstday: number
) => {
  const prev = dayjs(`${year}-${month + 1}-01`).subtract(1, "month");
  const days = createMonthDays(prev.year(), prev.month(), prev.daysInMonth());
  return days.slice(-firstday || days.length).map((d, index) => {
    return {
      date: d.date,
      dayOfMonth: d.dayOfMonth,
      isCurrentMonth: false,
      weekday: getWeekday(`${prev.year()}-${prev.month()}-${index + 1}`),
    };
  });
};

const createDaysForNextMonth = (
  year: number,
  month: number,
  lastday: number
) => {
  const next = dayjs(`${year}-${month}-01`).add(1, "month");
  const days = createMonthDays(next.year(), next.month(), next.daysInMonth());
  return days.slice(0, 6 - lastday).map((d, index) => {
    return {
      date: d.date,
      dayOfMonth: d.dayOfMonth,
      isCurrentMonth: false,
      weekday: getWeekday(`${next.year()}-${next.month()}-${index + 1}`),
    };
  });
};

function getWeekday(date: string) {
  return dayjs(date).weekday();
}

const createDaysArray = (date: Dayjs) => {
  let cdate = dayjs(date);
  let month = cdate.month();
  let year = cdate.year();
  // console.log('date', cdate.format('MMMM YYYY'), 'numDays', dayjs(date).daysInMonth())
  let days = createMonthDays(year, month, cdate.daysInMonth());
  let firstDay = days[0].weekday;
  let lastDay = days[days.length - 1].weekday;
  return [
    ...createDaysForPreviousMonth(year, month, firstDay),
    ...days,
    ...createDaysForNextMonth(year, month, lastDay),
  ];
};

// https://www.iandevlin.com/blog/2015/07/html5/building-a-semantic-calendar-in-html5/
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const NOW = dayjs();
const INITIAL_DAYS = createDaysArray(NOW);

// TODO:
// Add click to open event page for the date.
// designs for that page could be: https://codepen.io/davidkpiano/pen/xwyVXO or https://codepen.io/peanav/pen/ulkof

export function Calendar () {
  const [days, setDays] = createSignal(INITIAL_DAYS);
  const [selectedDate, setSelectedDate] = createSignal(NOW);

  const panMonth = (op?: 'add' | 'subtract') => {
    if (op) return setSelectedDate((state) => dayjs(state)[op](1, "month") );
    return setSelectedDate(NOW);
  };

  createEffect(() => {
    setDays(createDaysArray(selectedDate()));
  }, [selectedDate]);

  return (
    <div class="month">
      <header class="month-header">
        <h1 class="calendar_month_header_selected_month">
          {selectedDate().format("MMMM YYYY")}
        </h1>
        <section class="month-header-buttons">
          <button class="contrast" onClick={() => panMonth("subtract")}> ← </button>
          <button class="ghost" onClick={() => panMonth()}>Today</button>
          <button class="contrast" onClick={() => panMonth("add")}> → </button>
        </section>
      </header>

      <ol class="day-of-week olist">
        <For each={WEEKDAYS}>{(d) => <li>{d}</li>}</For>
      </ol>

      <ol class="days-grid olist">
        <For each={days()}>
          {(d) => (
            <li
              class={`calendar-day litem ${
                !d.isCurrentMonth && "calendar-day-not-current"
              } ${d.date === NOW.format("YYYY-MM-DD") && "calendar-day-today"}`}
            >
              <time datetime={d.date}>{d.dayOfMonth}</time>
            </li>
          )}
        </For>
      </ol>
      <style>
        {`.olist, .litem {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  
  .month {
    position: relative;
    background-color: var(--grey-2);
    border: solid 1px var(--grey-2);
    margin: 2rem auto 5rem;
    max-width: 1200px;
  }
  
  .month-header {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px;
  }
  
  .month-header-buttons {
    display: flex;
    gap: 1em;
    align-items: center;
    justify-content: space-between;
  }
  
  .month-header-buttons > * {
    cursor: pointer;
  }
  
  .day-of-week {
    color: var(--grey-8);
    font-size: 18px;
    background-color: #fff;
    padding-bottom: 5px;
    padding-top: 10px;
  }
  
  .day-of-week,
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }  
  .day-of-week > * {
    text-align: right;
    padding-right: 5px;
  }
  
  .days-grid {
    height: 100%;
    position: relative;
    grid-column-gap: var(--grid-gap);
    grid-row-gap: var(--grid-gap);
    border-top: solid 1px var(--grey-2);
  }
  
  .calendar-day {
    position: relative;
    min-height: 100px;
    font-size: 16px;
    background-color: #fff;
    color: var(--grey-8);
    padding: 5px;
  }
  
  .calendar-day > time {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 2px;
    width: var(--day-label-size);
    height: var(--day-label-size);
  }
  
  .calendar-day-not-current {
    background-color: var(--grey-1);
    color: var(--grey-300);
  }
  
  .calendar-day-today {
    padding-top: 4px;
    background-color: var(--tan);
  }
  
  .calendar-day-today > time {
    color: #fff;
    border-radius: 9999px;
    background-color: var(--grey-8);
    padding: 1em;
  }`}
      </style>
    </div>
  );
}
