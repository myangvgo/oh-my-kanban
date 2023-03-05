/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import KanbanBoard from "./KanbanBoard";
import KanbanColumn from "./KanbanColumn";

const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#c9af97",
  ongoing: "#ffe799",
  done: "#c0e8ba",
};

const DATA_STORE_KEY = "kanban-data-store";
const COLUMN_KEY_TODO = "todo";
const COLUMN_KEY_ONGOING = "ongoing";
const COLUMN_KEY_DONE = "done";

function App() {
  const [todoList, setTodoList] = useState([
    { title: "开发任务-1", status: "2023-03-01 18:15" },
    { title: "开发任务-3", status: "2023-03-01 18:15" },
    { title: "开发任务-5", status: "2023-03-01 18:15" },
    { title: "测试任务-3", status: "2023-03-02 15:15" },
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: "开发任务-4", status: "2023-03-01 18:15" },
    { title: "开发任务-6", status: "2023-03-01 18:15" },
    { title: "测试任务-2", status: "2023-03-01 18:15" },
  ]);
  const [doneList, setDoneList] = useState([
    { title: "开发任务-2", status: "2023-03-01 18:15" },
    { title: "测试任务-1", status: "2023-03-01 18:15" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const handleAdd = (newCard) => {
    setTodoList((currentTodoList) => [newCard, ...currentTodoList]);
  };
  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  };

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const handleDrop = (evt) => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }
    const updaters = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };
    if (dragSource) {
      updaters[dragSource]((currentStat) =>
        currentStat.filter((item) => !Object.is(item, draggedItem))
      );
    }
    if (dragTarget) {
      updaters[dragTarget]((currentStat) => [draggedItem, ...currentStat]);
    }
  };

  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板 <button onClick={handleSaveAll}>保存所有卡片</button>
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        {isLoading ? (
          <KanbanColumn
            bgColor={COLUMN_BG_COLORS.loading}
            title="读取中..."
          ></KanbanColumn>
        ) : (
          <>
            <KanbanColumn
              canAddNew
              bgColor={COLUMN_BG_COLORS.todo}
              title="待处理"
              setDraggedItem={setDraggedItem}
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_TODO : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_TODO : null)
              }
              onAdd={handleAdd}
              onDrop={handleDrop}
              cardList={todoList}
            ></KanbanColumn>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.ongoing}
              title="进行中"
              setDraggedItem={setDraggedItem}
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_ONGOING : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_ONGOING : null)
              }
              onDrop={handleDrop}
              cardList={ongoingList}
            ></KanbanColumn>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.done}
              title="已完成"
              setDraggedItem={setDraggedItem}
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_DONE : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_DONE : null)
              }
              onDrop={handleDrop}
              cardList={doneList}
            ></KanbanColumn>
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
