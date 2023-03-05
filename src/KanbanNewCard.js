/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { kanbanCardStyles, kanbanCardTitleStyles } from "./KanbanCard";

export default function KanbanNewCard({ onSubmit }) {
  const [title, setTitle] = useState("");
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      const newCard = { title, status: new Date().toString() };
      onSubmit(newCard);
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
}
