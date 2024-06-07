import {
  For,
  createEffect,
  createResource,
  createSignal,
  type Setter,
} from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { hw_1, hw_2 } from "../data/hw";
import { hw_3 } from "../data/hw_old";
import { projects_1, projects_2, projects_3 } from "../data/projects";
import projectIcon from "../icons/project.svg";
import homeworkIcon from "../icons/homework.svg";
// import { supabase } from '../lib/supabase'

type KanbanTypes = {
  data: any[];
  hw?: number[];
  projects?: number[];
};

const hw1 = hw_1.filter((h): h is string => !!h);
const hw2 = hw_2.filter((h): h is string => !!h);
const hw3 = hw_3.filter((h): h is string => !!h);

const hws: string[][] = [hw1, hw2, hw3];

const proj1 = projects_1.filter((h): h is string => !!h);
const proj2 = projects_2.filter((h): h is string => !!h);
const proj3 = projects_3.filter((h): h is string => !!h);

const projs: string[][] = [proj1, proj2, proj3];

export function Kanban(props: KanbanTypes) {
  const [kanban, setKanban] = makePersisted(createSignal("kanban"));
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
  // const [data, {mutate, refetch}] = createResource(updateKanban)

  const [section, setSection] = createSignal(1);
  const hw_todo = hws[section() - 1];
  const hw_doing: string[] = [];
  const hw_review: string[] = [];
  const hw_done: string[] = [];

  const proj_todo = projs[section() - 1];
  const proj_doing: string[] = [];
  const proj_review: string[] = [];
  const proj_done: string[] = [];

  const lanes = [
    { title: "Todo", hwk: hw_todo, prj: proj_todo },
    { title: "Doing", hwk: hw_doing, prj: proj_doing },
    { title: "In Review", hwk: hw_review, prj: proj_review },
    { title: "Done", hwk: hw_done, prj: proj_done },
  ];

  const laning  = {
    todo: [
      ...proj_todo.map((h) => ({ name: h, type: "proj" })),
      ...hw_todo.map((h) => ({ name: h, type: "hw" })),
    ],
    doing: [],
    "in review": [],
    done: [],
  }
  return (
    <div class="board">
      <div class="lanes">
        <For each={Object.entries(laning)}>
          {([title, task]) => (
            <div
              id={`${title.toLowerCase()}-lane`}
              class="lane"
              onDragOver={(e) => laneListener(e, title)}
              onDragLeave={laneCleanup}
              onDragEnd={laneCleanup}
            >
              <h2 class="heading">{title}</h2>
              <For each={task}>
                {(t) => (
                  <div
                  class={`task ${t.type}`}
                  draggable="true"
                  onClick={(e) => (console.log('clicked'), e.target.classList.toggle("dragging"))}
                  onDragStart={(e) => (console.log('dragging'), e.target.classList.add("dragging"))}
                  onDragEnd={(e) => taskCleanup(e, setKanban)}
                >
                  <img src={t.type === "hw" ? homeworkIcon.src : projectIcon.src} />
                  <span>{t.name}</span>
                  {t.type === "proj" ? (
                    <div>
                      <label class="hidden sr-only" for={`project-${t.name}`}>
                        Project Link:
                      </label>
                      <input
                        type="text"
                        placeholder="Project Link"
                        id={`project-${t.name}`}
                        name={`project-${t.name}`}
                        style="padding: 4px; margin-top: 4px; height: auto"
                      />
                    </div>
                  ) : null}
                </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <style>{css}</style>
    </div>
  );
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
`;

const allowSortDrop = true;

function getDragAfterElement(mouseY: number, container?: HTMLElement) {
  if (!container) return null;
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest: any, child: any) => {
      const box = child.getBoundingClientRect();
      const offset = mouseY - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset
        ? { offset: offset, element: child }
        : closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
const laneCleanup = async (e: DragEvent) => {
  e?.stopPropagation();
  document
    .querySelectorAll(".lane")
    .forEach((lane) => lane.classList.remove("dragover"));
};

const laneListener = (e: DragEvent, title: string) => {
  e.preventDefault();
  const lane =
    document.getElementById(`${title.toLowerCase()}-lane`) ?? undefined;
  lane?.classList?.add("dragover");
  const afterElement = getDragAfterElement(e.clientY, lane);
  const draggable = document.querySelector(".dragging");
  allowSortDrop && afterElement
    ? lane?.insertBefore(draggable!, afterElement)
    : lane?.appendChild(draggable!);
};

const taskCleanup = (e: DragEvent, setKanban: Setter) => {
  e?.target?.classList.remove("dragging");
  const taskType = e.target?.classList?.contains("hw") ? "hw" : "proj";
  const taskText = e.target?.textContent;
  console.log(taskType, taskText);
  // setKanban(prev => {
  //   const data = JSON.parse(prev)
  //   data[taskType].concat{ taskType, taskText }
  // })
};
