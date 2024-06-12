export const css = `
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
  max-width: 300px;
  min-width: 280px;
  flex-shrink: 0;
  overflow: scroll;
  max-height: calc(80vh - 32px);
  min-height: 100%;
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
.task.proj input {
  padding: 4px; 
  margin-top: 4px; 
  height: auto;
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