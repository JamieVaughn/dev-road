import {
  For,
  createEffect,
  createResource,
  createSignal,
  type Setter,
} from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import projectIcon from '../icons/project.svg'
import homeworkIcon from '../icons/homework.svg'
import { supabase } from '../lib/supabase'

type KanbanTypes = {
  data: any[]
  hw?: number[]
  projects?: number[]
}

export function Kanban(props: KanbanTypes) {
  const [section, setSection] = createSignal(1)

  createEffect(() => {
    console.log('kanban', props)
    console.log('section', section)
  })
  // const updateKanban = async () => {
  // const { data, error } = await supabase
  //   .from('kanban')
  //   .insert({
  //     [taskType]: 'otherValue',
  //     history: {[taskText]: ['doing', Date.now()]}
  //   })
  //   .eq('some_column', 'someValue')
  //   .select()
  //   if(error) return error
  //   return data
  // }
  // {
  //   "done": [],
  //   "todo": [],
  //   "doing": [],
  //   "review": []
  // }

  // const [data, {mutate, refetch}] = createResource(updateKanban)

  // ...proj_todo.map((h) => ({ name: h, type: "proj" })),
  // ...hw_todo.map((h) => ({ name: h, type: "hw" })),
  type Task = { name: string; type: 'hw' | 'proj' }
  const expandTasks = (tasks: string[], type: 'hw' | 'proj') =>
    tasks.map((name) => ({ name, type }))
  const lanes: Array<{
    title: 'Todo' | 'Doing' | 'In Review' | 'Done'
    task: Task[]
    hw: Task[]
    proj: Task[]
  }> = [
    {
      title: 'Todo',
      task: [
        ...expandTasks(['test_hw'], 'hw'),
        ...expandTasks(['test_proj'], 'proj'),
      ],
      hw: [],
      proj: [],
    },
    { title: 'Doing', task: [], hw: [], proj: [] },
    { title: 'In Review', task: [], hw: [], proj: [] },
    { title: 'Done', task: [], hw: [], proj: [] },
  ]

  // const laning  = {
  //   todo: [],
  //   doing: [],
  //   "in review": [],
  //   done: [],
  // }

  return (
    <div
      class='board'
      onClick={() => (setSection((prev) => prev + 1), console.log('test'))}
    >
      <div class='lanes'>
        <For each={lanes}>
          {({ title, task }) => (
            <div
              id={`${title.toLowerCase()}-lane`}
              class='lane'
              onDragOver={(e) => laneListener(e, title)}
              onDragLeave={laneCleanup}
              onDragEnd={laneCleanup}
            >
              <h2 class='heading'>{title}</h2>
              <For each={task}>
                {(t) => (
                  <div
                    class={`task ${t.type}`}
                    draggable='true'
                    onDragStart={(e) => (
                      console.log('dragging'),
                      e.target.classList.add('dragging')
                    )}
                    onDragEnd={(e) => taskCleanup(e)}
                  >
                    <img
                      src={t.type === 'hw' ? homeworkIcon.src : projectIcon.src}
                    />
                    <span>{t.name}</span>
                    {t.type === 'proj' && (
                      <div>
                        <label class='hidden sr-only' for={`project-${t.name}`}>
                          Project Link:
                        </label>
                        <input
                          type='text'
                          placeholder='Project Link'
                          id={`project-${t.name}`}
                          name={`project-${t.name}`}
                          style='padding: 4px; margin-top: 4px; height: auto'
                        />
                      </div>
                    )}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <style>{css}</style>
    </div>
  )
}

const css = `
.board * {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.board *::-webkit-scrollbar {
  display: none;
}
.board {
  margin: 0 auto;
  padding: 16px;
  width: fit-content;
  border-radius: 4px;
  background: linear-gradient(45deg, var(--violet), rebeccapurple, var(--tan));
  max-height: 80vh;
  overflow: hidden;
}
.board h2 {
  font-weight: 700;
  font-family: sans-serif;
  font-size: 28px;
  padding: 16px 16px 4px;
  position: sticky;
  top: 0;
  background: white;
  background-color: #f4f4f4;
}
.lanes {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  overflow: scroll;
  height: 100%;
  text-transform: capitalize;
}
.lane {
  display: flex;
  gap: 8px;
  flex-direction: column;
  background: #f4f4f4;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  min-height: 130.5px;
  min-width: 225px;
  flex-shrink: 0;
  overflow: scroll;
  max-height: calc(80vh - 32px);
  padding-bottom: 16px;
}
.task {
  font-size: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  margin: 0 8px;
  border-radius: 4px;
  text-transform: capitalize;
  font-size: 16px;
  transition: transform 0.5s;
  cursor: grab;
}
.task img {
  margin-right: 4px;
}
.task.hw {
  background-color: rgba(244, 81, 30, 0.05);
}
.task.proj {
  background-color: rgb(245, 230, 255, 0.5);
}
.task:active {
  cursor: grabbing;
}
.task:hover {
  outline: 2px dashed indigo;
}
.task.dragging img {
  filter: invert(1);
}
.lane .task.dragging {
  background-color: rgb(75, 0, 130);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  color: white;
  transform: rotate(3deg) scale(1.1);
}
.dragover {
  background-color: linen;
  outline: 2px dotted white;
}
html[data-theme="dark"] .board * {
  color: var(--extra-dark);
}
`

const allowSortDrop = true

function getDragAfterElement(mouseY: number, container?: HTMLElement) {
  if (!container) return null
  const draggableElements = [
    ...container.querySelectorAll('.task:not(.dragging)'),
  ]
  return draggableElements.reduce(
    (closest: any, child: any) => {
      const box = child.getBoundingClientRect()
      const offset = mouseY - box.top - box.height / 2
      return offset < 0 && offset > closest.offset
        ? { offset: offset, element: child }
        : closest
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
const laneCleanup = (e: DragEvent) => {
  e?.stopPropagation()
  document
    .querySelectorAll('.lane')
    .forEach((lane) => lane.classList.remove('dragover'))
}

const laneListener = (e: DragEvent, title: string) => {
  e.preventDefault()
  const lane =
    document.getElementById(`${title.toLowerCase()}-lane`) ?? undefined
  lane?.classList?.add('dragover')
  const afterElement = getDragAfterElement(e.clientY, lane)
  const draggable = document.querySelector('.dragging')
  allowSortDrop && afterElement
    ? lane?.insertBefore(draggable!, afterElement)
    : lane?.appendChild(draggable!)
}

const taskCleanup = (e: DragEvent, setKanban?: Setter<string>) => {
  const target = e.target as HTMLElement
  target?.classList.remove('dragging')
  const taskType = target?.classList?.contains('hw') ? 'hw' : 'proj'
  const taskText = target?.textContent
  console.log(taskType, taskText)
  // setKanban(prev => {
  //   const data = JSON.parse(prev)
  //   data[taskType].concat{ taskType, taskText }
  // })
}
