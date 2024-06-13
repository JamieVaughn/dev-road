import {
  For,
  createEffect,
  createSignal,
  createResource,
  type Accessor,
  type Setter,
} from "solid-js";
import { makePersisted } from '@solid-primitives/storage'
import projectIcon from "../icons/project.svg";
import homeworkIcon from "../icons/homework.svg";
import { css } from "./Kanban.css";

type Tasks = {
  todo: string[];
  doing: string[];
  review: string[];
  done: string[];
};

type KanbanTypes = {
  data: { hw: Tasks; proj: Tasks };
  user_id: string;
  email: string;
  hw?: number[];
  projects?: number[];
};

const fetchKanbanResource = async (body: string) => (await fetch('/api/kanban/update', {method: 'POST', body})).json()

export function Kanban(props: KanbanTypes) {
  const [section, setSection] = createSignal(1);
  const [selected, setSelected] = createSignal(null);
  const [history, setHistory] = createSignal(props.data.history ?? []);

  const [lanes, setLanes] = createSignal([
    { title: "todo", hw: props.data.hw.todo, proj: props.data.proj.todo },
    { title: "doing", hw: props.data.hw.doing, proj: props.data.proj.doing },
    {
      title: "in review",
      hw: props.data.hw.review,
      proj: props.data.proj.review,
    },
    { title: "done", hw: props.data.hw.done, proj: props.data.proj.done },
  ]);

  const [kanban] = createResource(JSON.stringify({
    lanes: lanes(),
    history: history(),
    email: props.email,
  }), fetchKanbanResource)


  createEffect(() => {
    console.log("history", {
      history: history(),
    });
    kanban()
  });

  return (
    <div class="board">
      <div class="lanes">
        <For each={lanes()}>
          {({ title, hw, proj }) => (
            <div
              id={`${title.toLowerCase()}-lane`}
              class="lane"
              onDragOver={(e) => laneListener(e, title)}
              onDragLeave={laneCleanup}
              onDragEnd={laneCleanup}
            >
              <h2 class="heading">{title}</h2>
              <For each={hw}>
                {(item) =>
                  taskComp(
                    item,
                    "hw",
                    setLanes,
                    selected,
                    setSelected,
                    setHistory
                  )
                }
              </For>
              <For each={proj}>
                {(item) =>
                  taskComp(
                    item,
                    "proj",
                    setLanes,
                    selected,
                    setSelected,
                    setHistory
                  )
                }
              </For>
            </div>
          )}
        </For>
      </div>
      <style>{css}</style>
    </div>
  );
}

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
const laneListener = (e: DragEvent, title: string, allowSortDrop = false) => {
  e.preventDefault();
  if(!e.target?.id.includes('-lane')) return
  const lane =
    document.getElementById(`${title.toLowerCase()}-lane`) ?? undefined;
  lane?.classList?.add("dragover");
  const afterElement = getDragAfterElement(e.clientY, lane);
  const draggable = document.querySelector(".dragging");
  allowSortDrop && afterElement
    ? lane?.insertBefore(draggable!, afterElement)
    : lane?.appendChild(draggable!);
};
const taskComp = (
  task: string,
  type: "hw" | "proj",
  setLanes: Setter<any>,
  selected: Accessor<any>,
  setSelected: Setter<any>,
  setHistory: Setter<any>
) => (
  <p
    class={`task ${type}`}
    draggable="true"
    onDragStart={(e) => {
      e.target.classList.add("dragging");
      setSelected({ lane: e.target.parentNode?.id.split("-")[0], task });
    }}
    onDragEnd={(e) => {
      e.target.classList.remove("dragging");
      const laneId = e.target.parentNode?.id
      if(!laneId || laneId.startsWith(selected().lane)) {
        setSelected(null)
        return
      }

      const dropLane = laneId.split("-")[0];
      if (selected()) {
        setLanes((prev) => {
          const result = prev.map((lane) => {
            if (lane.title === selected().lane) {
              return {
                ...lane,
                [type]: lane[type].filter((t) => t !== selected().task),
              };
            }
            if (lane.title === dropLane) {
              return {
                ...lane,
                [type]: lane[type].concat(selected().task),
              };
            }
            return lane;
          });
          return result;
        });

        setHistory((prev) =>
          prev.concat({
            timestamp: Date.now(),
            task: selected().task,
            fromLane: selected().lane,
            toLane: dropLane,
            type,
          })
        );
      }
      setSelected(null);
    }}
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
        />
      </div>
    )}
  </p>
);
