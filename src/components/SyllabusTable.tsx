import { For, createEffect } from "solid-js";
import { createSignal } from "solid-js";
import { SelectMenu } from "./Select";

const rows: Array<{ level: Array<'i' | 'ii' | 'iii'>, project: string, topic: string, hours: number }> = [
  {level: ['i'], project: 'HTML Resume', topic: 'Semantic HTML', hours: 9},
  {level: ['i'], project: 'Survey Form', topic: 'Accessibility & UI/UX', hours: 3},
  {level: ['i'], project: 'Tribute Page', topic: 'Basic CSS', hours: 9},
  {level: ['i'], project: 'Documentation Page', topic: 'CSS Layout', hours: 15},
  {level: ['i'], project: '', topic: 'Web Browsers & the Render Pipeline', hours: 3},
  {level: ['i'], project: 'Pattern Library', topic: 'Media Queries', hours: 3},
  {level: ['i'], project: '', topic: 'Mobile Responsive Design', hours: 3},
  {level: ['i'], project: 'Product Page', topic: 'Images & SVG', hours: 6},
  {level: ['i'], project: '', topic: 'GitHub & VSCode', hours: 6},
  {level: ['i'], project: 'Portfolio Site', topic: 'Individual Portfolio Project', hours: 3},
  {level: ['ii'], project: '', topic: 'Javascript Primitives', hours: 3},
  {level: ['ii'], project: 'Todo list', topic: 'Javascript Data Structures', hours: 6},
  {level: ['ii'], project: '', topic: 'Procedural Javascript', hours: 3},
  {level: ['ii'], project: 'Calculator', topic: 'The DOM API', hours: 3},
  {level: ['ii'], project: '', topic: 'Debugging', hours: 3},
  {level: ['ii'], project: 'FCC.org Projects', topic: 'Regular Expressions', hours: 3},
  {level: ['ii'], project: '', topic: 'ES6 & Beyond', hours: 9},
  {level: ['ii'], project: 'Pokemon Search App', topic: 'Functional Programming Concepts', hours: 3},
  {level: ['ii'], project: '', topic: 'The Event Loop', hours: 3},
  {level: ['ii'], project: '', topic: 'Asynchronous Javascript', hours: 12},
  {level: ['ii'], project: '', topic: 'Version Control with Github', hours: 3},
  {level: ['ii'], project: 'Incremental Clicker App', topic: 'Javascript Design Patterns', hours: 6},
  {level: ['ii'], project: '', topic: 'Javascript Application Architecture', hours: 3},
  {level: ['iii'], project: '', topic: 'Node.js, Git & the Terminal', hours: 3},
  {level: ['iii'], project: '', topic: 'Intro to React & JS Frameworks', hours: 9},
  {level: ['iii'], project: '', topic: 'JSX Templating', hours: 3},
  {level: ['iii'], project: 'Dice Simulator', topic: 'React Hooks', hours: 9},
  {level: ['iii'], project: 'Todo List', topic: 'Forms in React', hours: 3},
  {level: ['iii'], project: '', topic: 'React Build Tools', hours: 6},
  {level: ['iii'], project: 'Hacker News App', topic: 'React Router', hours: 3},
  {level: ['iii'], project: '', topic: 'Advanced React Patterns', hours: 3},
  {level: ['iii'], project: 'Simple Word Processor', topic: 'State Management', hours: 6},
  {level: ['iii'], project: '', topic: 'Application Architecture', hours: 6},
  {level: ['iii'], project: 'Database Read/Write App', topic: 'Databases & Authentication w/ Supabase', hours: 6},
  {level: ['iii'], project: '', topic: 'Resume, Interviewing and Career Skills', hours: 3},
]

export function SyllabusTable () {
  const [level, setLevel] = createSignal(1);
  const [filteredRows, setFilteredRows] = createSignal(rows.filter(row => row.level[0].length === level()));
  const [total, setTotal] = createSignal(filteredRows().reduce((acc, cur) => acc + cur.hours, 0));
  
  createEffect(() => {
    setFilteredRows(rows.filter(row => row.level[0].length === (level())))
    setTotal(filteredRows().reduce((acc, cur) => acc + cur.hours, 0))
  })

  return (
    <table role="grid">
      <thead>
        <tr>
          <th scope="col" style="min-width: 400px"><span style="margin-top: 16px">Topic</span></th>
          <th scope="col" style="min-width: 400px"><span style="margin-top: 16px">Project</span></th>
          <th  style="display: flex; justify-content: center; align-items: center; gap: 1em; width: 350px;">
            <span>Level</span>
            <SelectMenu level={level} setLevel={setLevel} />
          </th>
          <th><span style="margin-top: 16px">Hours</span></th>
        </tr>
      </thead>
      <tbody>
          <For each={filteredRows()}>
          {(row) => (
            <tr>
              <td>{row.topic}</td>
              <td>{row.project}</td>
              <td style="text-align: center">{row.level}</td>
              <td>{row.hours}</td>
            </tr>
          )}
          </For>
          <tr>
            <td></td>
            <td></td>
            <td style="text-align: right">Total hours in Level {level()}:</td>
            <td>{total()}</td>
          </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td style="display: flex; gap: 8px;">
            <button class="ghost slim" disabled={level() === 1} onclick={() => setLevel(level() <= 1 ? 1 : level() - 1)}>‹</button>
            <button class="ghost slim" style="padding: 1px" disabled={level() === 1} onclick={() => setLevel(1)}>1</button>
            <button class="ghost slim" style="padding: 1px" disabled={level() === 2} onclick={() => setLevel(2)}>2</button>
            <button class="ghost slim" style="padding: 1px" disabled={level() === 3} onclick={() => setLevel(3)}>3</button>
            <button class="ghost slim" disabled={level() === 3} onclick={() => setLevel(level() >= 3 ? 3: level() + 1)}>›</button>
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  );
}