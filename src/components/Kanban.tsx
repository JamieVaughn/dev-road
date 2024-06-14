import {
  For,
  createEffect,
  createSignal,
  createResource,
  type Accessor,
  type Setter,
} from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import projectIcon from "../icons/project.svg";
import homeworkIcon from "../icons/homework.svg";
import { css } from "./Kanban.css";

type HistoryItemType = {
  timestamp: number;
  task: string;
  fromLane: string;
  toLane: string;
  type: string;
}

type Tasks = {
  todo: string[];
  doing: string[];
  review: string[];
  done: string[];
  history: HistoryItemType[];
};

type LaneType = {
  title: string;
  hw: string[];
  proj: string[];
}

type KanbanTypes = {
  hw: Tasks;
  proj: Tasks;
  user_id: string;
  email: string;
};

const fetchKanbanResource = async (options: {body: string, origin: string}) =>
  (await fetch(`${options.origin}/api/kanban/update`, { method: "POST", body: options.body })).json();

export function Kanban(props: KanbanTypes) {
  // console.log("props", props)
  const [section, setSection] = createSignal(1);
  const [selected, setSelected] = createSignal(null);
  const [historyHw, setHistoryHw] = createSignal(props.hw?.history ?? []);
  const [historyProj, setHistoryProj] = createSignal(props.proj?.history ?? []);

  const [lanes, setLanes] = createSignal<LaneType[]>([
    { title: "todo", hw: props.hw.todo, proj: props.proj.todo },
    { title: "doing", hw: props.hw.doing, proj: props.proj.doing },
    { title: "review", hw: props.hw.review, proj: props.proj.review },
    { title: "done", hw: props.hw.done, proj: props.proj.done },
  ]);

  const [kanban] = createResource({
    origin: 'http://localhost:4321',
    body: JSON.stringify({
      lanes: lanes(),
      historyHw: historyHw(),
      historyProj: historyProj(),
      email: props.email,
    })},
    fetchKanbanResource
  );

  createEffect(() => {
    console.log('post', {
      lanes: lanes(),
      historyHw: historyHw(),
      historyProj: historyProj(),
      email: props.email,
    })
    kanban();
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
                    setHistoryHw
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
                    setHistoryProj
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
  const target = e.target as HTMLElement;
  if (!target?.id.includes("-lane")) return;
  const lane =
    document.getElementById(`${title.toLowerCase()}-lane`) ?? undefined;
  lane?.classList?.add("dragover");
  const afterElement = getDragAfterElement(e.clientY, lane);
  const draggable = document.querySelector(".dragging");
  allowSortDrop && afterElement
    ? lane?.insertBefore(draggable!, afterElement)
    : lane?.appendChild(draggable!);
}

const taskComp = (
  task: string,
  type: "hw" | "proj",
  setLanes: Setter<LaneType[]>,
  selected: Accessor<any>,
  setSelected: Setter<any>,
  setHistory: Setter<any>
) => (
  <div
    class={`task ${type}`}
    draggable="true"
    onDragStart={(e) => {
      const parent = e.target?.parentNode as  HTMLElement
      e.target.classList.add("dragging");
      setSelected({ lane: parent?.id.split("-")[0], task });
    }}
    onDragEnd={(e) => {
      const parent = e.target?.parentNode as  HTMLElement
      e.target.classList.remove("dragging");
      const laneId = parent?.id;
      if (!laneId || laneId.startsWith(selected().lane)) {
        setSelected(null);
        return;
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
  </div>
);
