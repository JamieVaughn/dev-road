import { type Accessor, type Setter } from 'solid-js'

export function SelectMenu(props: {
  level: Accessor<number>
  setLevel: Setter<number>
}) {
  return (
    <div style='margin: 0 1px 1px; min-width: 80px; border-bottom: 1px solid silver;'>
      <label for='level-select' hidden>
        Level
      </label>
      <select
        style='margin: 0; border: 0; user-select: none; padding-block: 0;'
        id='level-select'
        onInput={(e) => props.setLevel(Number(e.target.selectedIndex) + 1)}
      >
        <option value={1}>i</option>
        <option value={2}>ii</option>
        <option value={3}>iii</option>
      </select>
    </div>
  )
}
