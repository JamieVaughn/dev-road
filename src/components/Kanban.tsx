import { For } from "solid-js";

type KanbanTypes = {
  hw: number[];
  projects: number[];
};

const allowSortDrop = true;

function getDragAfterElement(mouseY: number, container?: HTMLElement) {
  if(!container) return null;
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
  document.querySelectorAll('.lane').forEach((lane) => lane.classList.remove("dragover"));
};
const laneListener = (e: DragEvent, title: string) => {
  e.preventDefault();
  const lane = document.getElementById(`${title.toLowerCase()}-lane`) ?? undefined;
  lane?.classList?.add("dragover");
  const afterElement = getDragAfterElement(e.clientY, lane);
  const draggable = document.querySelector(".dragging");
  allowSortDrop && afterElement
    ? lane?.insertBefore(draggable!, afterElement)
    : lane?.appendChild(draggable!);
};
const tackComp = (task: string) => (
  <p
    class="task"
    draggable="true"
    onDragStart={(e) => e.target.classList.add("dragging")}
    onDragEnd={(e) => e.target.classList.remove("dragging")}
  >
    {task}
  </p>
);

export function Kanban(props: KanbanTypes) {
  const hw_todo = ["CSS", "Javascript", "React"];
  const hw_doing = ["HTML"];
  const hw_review = ["Portfolio"];
  const hw_done: string[] = [];

  const lanes = [
    { title: "Todo", tasks: hw_todo },
    { title: "Doing", tasks: hw_doing },
    { title: "In Review", tasks: hw_review },
    { title: "Done", tasks: hw_done },
  ];

  return (
    <div class="board">
      <div class="lanes">
        <For each={lanes}>
          {({ title, tasks }) => (
            <div
              id={`${title.toLowerCase()}-lane`}
              class="lane"
              onDragOver={e => laneListener(e, title)}
              onDragLeave={laneCleanup}
              onDragEnd={laneCleanup}
            >
              <h2 class="heading">{title}</h2>
              <For each={tasks}>{tackComp}</For>
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
  width: fit-content;
  border-radius: 4px;
  background: linear-gradient(45deg, var(--violet), rebeccapurple, var(--tan));
}
.board p {
  margin: 0;
}
.board h2 {
  font-weight: 700;
  font-family: sans-serif;
  font-size: 28px;
}
.lanes {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  overflow: scroll;
  height: 100%;
}
.lane {
  display: flex;
  gap: 12px;
  flex-direction: column;
  background: #f4f4f4;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  max-width: 33vw;
  min-height: 130.5px;
  min-width: 225px;
  flex-shrink: 0;
}
.task {
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  transition: transform 0.5s;
  cursor: grab;
}
.task:active {
  cursor: grabbing;
  transform: rotate(3deg);
}
.task:hover {
  background-color: rgb(75, 0, 130);
  color: white;
}
.dragging {
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
