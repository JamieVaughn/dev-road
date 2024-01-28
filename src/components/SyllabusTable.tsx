import { For, createEffect } from "solid-js";
import { createSignal } from "solid-js";
import { SelectMenu } from "./Select";

const rows = [
  {level: ['i'], topic: 'Semantic HTML', hours: 9},
  {level: ['i'], topic: 'Accessibility & UI/UX', hours: 3},
  {level: ['i'], topic: 'Basic CSS', hours: 9},
  {level: ['i'], topic: 'CSS Layout', hours: 15},
  {level: ['i'], topic: 'Web Browsers & the Render Pipeline', hours: 3},
  {level: ['i'], topic: 'Media Queries', hours: 3},
  {level: ['i'], topic: 'Mobile Responsive Design', hours: 3},
  {level: ['i'], topic: 'Images & SVG', hours: 6},
  {level: ['i'], topic: 'GitHub & VSCode', hours: 6},
  {level: ['i'], topic: 'Individual Portfolio Project', hours: 3},
  {level: ['ii'], topic: 'Javascript Primitives', hours: 3},
  {level: ['ii'], topic: 'Javascript Data Structures', hours: 6},
  {level: ['ii'], topic: 'Procedural Javascript', hours: 3},
  {level: ['ii'], topic: 'The DOM API', hours: 3},
  {level: ['ii'], topic: 'Debugging', hours: 3},
  {level: ['ii'], topic: 'Regular Expressions', hours: 3},
  {level: ['ii'], topic: 'ES6 & Beyond', hours: 9},
  {level: ['ii'], topic: 'Functional Programming Concepts', hours: 3},
  {level: ['ii'], topic: 'The Event Loop', hours: 3},
  {level: ['ii'], topic: 'Asynchronous Javascript', hours: 12},
  {level: ['ii'], topic: 'Version Control with Github', hours: 3},
  {level: ['ii'], topic: 'Javascript Design Patterns', hours: 6},
  {level: ['ii'], topic: 'Javascript Application Architecture', hours: 3},
  {level: ['iii'], topic: 'Node.js, Git & the Terminal', hours: 3},
  {level: ['iii'], topic: 'Intro to React & JS Frameworks', hours: 9},
  {level: ['iii'], topic: 'JSX Templating', hours: 3},
  {level: ['iii'], topic: 'React Hooks', hours: 9},
  {level: ['iii'], topic: 'Forms in React', hours: 3},
  {level: ['iii'], topic: 'React Build Tools', hours: 6},
  {level: ['iii'], topic: 'React Router', hours: 3},
  {level: ['iii'], topic: 'State Management', hours: 6},
  {level: ['iii'], topic: 'Advanced React Patterns', hours: 3},
  {level: ['iii'], topic: 'Project: Supabase CRUD Application', hours: 12},
  {level: ['iii'], topic: 'Resume, Interviewing and Career Skills', hours: 3},
]

// type row = Array<{ level: Array<'i' | 'ii' | 'iii'>, topic: string, hours: number }>

export function SyllabusTable (props: any) {
  const [level, setLevel] = createSignal(1);
  const [filteredRows, setFilteredRows] = createSignal(rows.filter(row => row.level[0].length === level()));
  const [total, setTotal] = createSignal(filteredRows().reduce((acc, cur) => acc + cur.hours, 0));
  
  // const handleClick = () => {
  //   setLevel(level() + 1)
  //   setFilteredRows(rows.filter(row => row.level[0].length === (level()%3 || 3)))
  //   setTotal(filteredRows().reduce((acc, cur) => acc + cur.hours, 0))
  //   console.log(level(), level()%3)
  // }
  createEffect(() => {
    setFilteredRows(rows.filter(row => row.level[0].length === (level())))
    setTotal(filteredRows().reduce((acc, cur) => acc + cur.hours, 0))
  })
  return (
    <table role="grid">
      <thead>
        <tr>
          <th scope="col" style="min-width: 400px"><span style="margin-top: 16px">Topic</span></th>
          <th  style="display: flex; justify-content: center; align-items: center; gap: 1em;">
            <span style="margin-top: 16px">Level</span>
            <SelectMenu level={level} setLevel={setLevel} />
            {/* <button style="width: max-content;" class="ghost slim" onclick={handleClick}>filter level: {(level() + 1)%3 || 3}</button> */}
          </th>
          <th><span style="margin-top: 16px">Hours</span></th>
        </tr>
      </thead>
      <tbody>
          <For each={filteredRows()}>
          {(row) => (
            <tr>
              <td>{row.topic}</td>
              <td style="text-align: center">{row.level}</td>
              <td>{row.hours}</td>
            </tr>
          )}
          </For>
          <tr>
            <td></td>
            <td style="text-align: right">Total hours in Level {level()}:</td>
            <td>{total()}</td>
          </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td style="display: flex; gap: 8px">
            <button class="ghost slim" disabled={level() === 1} onclick={() => setLevel(level() <= 1 ? 1 : level() - 1)}>‹</button>
            <button class="ghost slim" style="padding: 1px" onclick={() => setLevel(1)}>1</button>
            <button class="ghost slim" style="padding: 1px" onclick={() => setLevel(2)}>2</button>
            <button class="ghost slim" style="padding: 1px" onclick={() => setLevel(3)}>3</button>
            <button class="ghost slim" disabled={level() === 3} onclick={() => setLevel(level() >= 3 ? 3: level() + 1)}>›</button>
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  );
}