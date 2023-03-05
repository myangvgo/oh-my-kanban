/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import KanbanColumn from "./KanbanColumn";

const kanbanBoardStyles = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;

const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#c9af97",
  ongoing: "#ffe799",
  done: "#c0e8ba",
};

export const COLUMN_KEY_TODO = "todo";
export const COLUMN_KEY_ONGOING = "ongoing";
export const COLUMN_KEY_DONE = "done";

export default function KanbanBoard({
  isLoading = true,
  todoList,
  ongoingList,
  doneList,
  onAdd,
  onRemove,
}) {
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
    dragSource && onRemove(dragSource, draggedItem)
    dragTarget && onAdd(dragTarget, draggedItem)

  };

  return (
    <main css={kanbanBoardStyles}>
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
            onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}
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
    </main>
  );
}
