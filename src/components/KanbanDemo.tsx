import { For, createSignal } from "solid-js";
import { hw_1, hw_2 } from "../data/hw";
import { hw_3 } from "../data/hw_old";
import { projects_1, projects_2, projects_3 } from "../data/projects";
import projectIcon from "../icons/project.svg";
import homeworkIcon from "../icons/homework.svg";

type KanbanTypes = {
  hw: number[];
  projects: number[];
};

const hw1 = hw_1.filter((h): h is string => !!h);
const hw2 = hw_2.filter((h): h is string => !!h);
const hw3 = hw_3.filter((h): h is string => !!h);

const hws: string[][] = [hw1, hw2, hw3];

const proj1 = projects_1.filter((h): h is string => !!h);
const proj2 = projects_2.filter((h): h is string => !!h);
const proj3 = projects_3.filter((h): h is string => !!h);

const projs: string[][] = [proj1, proj2, proj3];

export function KanbanDemo(props: KanbanTypes) {
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
    { title: "Todo", hw: hw_todo, proj: proj_todo },
    { title: "Doing", hw: hw_doing, proj: proj_doing },
    { title: "In Review", hw: hw_review, proj: proj_review },
    { title: "Done", hw: hw_done, proj: proj_done },
  ];

  return (
    <div class="board">
      <div class="lanes">
        <For each={lanes}>
          {({ title, hw, proj }) => (
            <div
              id={`${title.toLowerCase()}-lane`}
              class="lane"
              onDragOver={(e) => laneListener(e, title)}
              onDragLeave={laneCleanup}
              onDragEnd={laneCleanup}
            >
              <h2 class="heading">{title}</h2>
              <For each={hw}>{(item) => taskComp(item, "hw")}</For>
              <For each={proj}>{(item) => taskComp(item, "proj")}</For>
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
  max-height: 80vh;
  overflow: hidden;
  background: linear-gradient(45deg, var(--violet), rebeccapurple, var(--tan));
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  margin: 0 8px;
  border-radius: 4px;
  text-transform: capitalize;
  font-size: 16px;
  transition: transform 0.5s;
  cursor: grab;
}
.task.proj img {
  vertical-align: top;
}
.task.hw img {
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
.task.dragging {
  background-color: rgb(75, 0, 130);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  color: white;
  transform: rotate(3deg) scale(1.1);
}
.dragover {
  background-color: linen;
  outline: 2px dotted white;
}
`;

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
const laneCleanup = (e: DragEvent) => {
  e?.stopPropagation();
  document
    .querySelectorAll(".lane")
    .forEach((lane) => lane.classList.remove("dragover"));
};
const laneListener = (e: DragEvent, title: string, allowSortDrop = true) => {
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
const taskComp = (task: string, type: "hw" | "proj") => (
  <p
    class={`task ${type}`}
    draggable="true"
    onDragStart={(e) => e.target.classList.add("dragging")}
    onDragEnd={(e) => e.target.classList.remove("dragging")}
  >
    <img src={type === "hw" ? homeworkIcon.src : projectIcon.src} />
    <span>{task}</span>
    {type === "proj" && (
      <div>
        <label class="hidden sr-only" for={`project-${task}`}>
          Project Link:
        </label>
        <input
          type="text"
          placeholder="Project Link"
          id={`project-${task}`}
          name={`project-${task}`}
          style="padding: 4px; margin-top: 4px; height: auto"
        />
      </div>
    )}
  </p>
);
