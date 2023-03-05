/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import logo from "./logo.svg";
import "./App.css";

const KanbanBoard = ({ children }) => (
  <main
    css={css`
      flex: 10;
      display: flex;
      flex-direction: row;
      gap: 1rem;
      margin: 0 1rem 1rem;
    `}
  >
    {children}
  </main>
);

const KanbanColumn = ({
  children,
  bgColor,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop,
}) => {
  return (
    <section
      onDragStart={() => setIsDragSource(true)}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "none";
        setIsDragTarget(false)
      }}
      onDrop={(evt) => {
        evt.preventDefault();
        onDrop && onDrop(evt);
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={css`
        flex: 1 1;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 1rem;
        background-color: ${bgColor};

        & > h2 {
          margin: 0.6rem 1rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid gray;

          & > button {
            float: right;
            margin-top: 0.2rem;
            padding: 0.2rem 0.5rem;
            border: 0;
            border-radius: 1rem;
            height: 1.8rem;
            line-height: 1rem;
            font-size: 1rem;
          }
        }

        & > ul {
          flex: 1;
          flex-basis: 0;
          margin: 1rem;
          padding: 0;
          overflow: auto;
        }
      `}
    >
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;

  &:hover {
    box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.2), inset 0 1px #fff;
  }
`;

const kanbanCardTitleStyles = css`
  min-height: 3rem;
`;

const kanbanCardStatusStyles = css`
  text-align: right;
  font-size: 0.8rem;
  color: #333;
`;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({ title, status, onDragStart }) => {
  const [displayTime, setDisplayTime] = useState(status);

  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = "刚刚";
      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR <= timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }
      setDisplayTime(relativeTime);
    };
    const intervalId = setInterval(setDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();
    return function cleanup() {
      clearInterval(intervalId);
    };
  }, [status]);

  const handleDragStart = (evt) => {
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("text/plain", title);
    onDragStart && onDragStart(evt);
  };
  return (
    <li css={kanbanCardStyles} draggable onDragStart={handleDragStart}>
      <div css={kanbanCardTitleStyles}>{title}</div>
      <div css={kanbanCardStatusStyles} title={status}>
        {displayTime}
      </div>
    </li>
  );
};

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      onSubmit(title);
    }
  };
  const inputElem = useRef(null);
  useEffect(() => {
    inputElem.current.focus();
  }, []);
  return (
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div
        css={css`
          ${kanbanCardTitleStyles}
          & > input[type="text"] {
            width: 80%;
          }
        `}
      >
        <input
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type="text"
          ref={inputElem}
        />
      </div>
    </li>
  );
};

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
  const [showAdd, setShowAdd] = useState(false);
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
  const handleAdd = (evt) => {
    setShowAdd(true);
  };
  const handleSubmit = (title) => {
    setTodoList((currentTodoList) => [
      {
        title,
        status: new Date().toDateString(),
      },
      ...currentTodoList,
    ]);
    setShowAdd(false);
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
              bgColor={COLUMN_BG_COLORS.todo}
              title={
                <>
                  待处理
                  <button onClick={handleAdd} disabled={showAdd}>
                    &#8853; 添加新卡片
                  </button>{" "}
                </>
              }
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_TODO : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_TODO : null)
              }
              onDrop={handleDrop}
            >
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {todoList.map((props) => (
                <KanbanCard
                  key={props.title}
                  onDragStart={() => setDraggedItem(props)}
                  {...props}
                />
              ))}
            </KanbanColumn>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.ongoing}
              title="进行中"
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_ONGOING : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_ONGOING : null)
              }
              onDrop={handleDrop}
            >
              {ongoingList.map((props) => (
                <KanbanCard
                  key={props.title}
                  onDragStart={() => setDraggedItem(props)}
                  {...props}
                />
              ))}
            </KanbanColumn>
            <KanbanColumn
              bgColor={COLUMN_BG_COLORS.done}
              title="已完成"
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_DONE : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_DONE : null)
              }
              onDrop={handleDrop}
            >
              {doneList.map((props) => (
                <KanbanCard
                  key={props.title}
                  onDragStart={() => setDraggedItem(props)}
                  {...props}
                />
              ))}
            </KanbanColumn>
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
