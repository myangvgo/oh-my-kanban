/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import KanbanBoard, {
  COLUMN_KEY_DONE,
  COLUMN_KEY_ONGOING,
  COLUMN_KEY_TODO,
} from "./KanbanBoard";

const DATA_STORE_KEY = "kanban-data-store";

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

  const updaters = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE]: setDoneList,
  };

  const handleAdd = (column, newCard) => {
    updaters[column]((currentTodoList) => [newCard, ...currentTodoList]);
  };

  const handleRemove = (column, cardToRemove) => {
    updaters[column]((currentStat) =>
      currentStat.filter((item) => !Object.is(item, cardToRemove))
    );
  };

  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
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
      <KanbanBoard
        isLoading={isLoading}
        todoList={todoList}
        ongoingList={ongoingList}
        doneList={doneList}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default App;
