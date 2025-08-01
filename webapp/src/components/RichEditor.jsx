// src/components/RichEditor.jsx
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState, useEffect } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

/**
 * value — строка JSON (raw-модель DraftJS) или пустая
 * onChange — (newRawJsonString) => void
 */
export default function RichEditor({ value, onChange, height = 200 }) {
  // инициализируем состояние редактора
  const [state, setState] = useState(() =>
    value
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(value)))
      : EditorState.createEmpty()
  );

  // при каждом изменении отдаём вверх raw JSON
  useEffect(() => {
    const raw = convertToRaw(state.getCurrentContent());
    onChange(JSON.stringify(raw));
  }, [state, onChange]);

  return (
    <Editor
      editorState={state}
      onEditorStateChange={setState}
      wrapperClassName="border rounded"
      editorStyle={{ minHeight: height, padding: 12 }}
      toolbar={{
        options: ["inline", "blockType", "list", "link", "image", "embedded", "history"],
        embedded: { defaultSize: { width: "100%", height: "400" } },
      }}
    />
  );
}
