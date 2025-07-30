import { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";      // если понадобится HTML
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RichEditor({ value, onChange, height = 200 }) {
  // value может приходить как '' (новый) или сохранённый raw‑JSON
  const [state, setState] = useState(() =>
    value
      ? EditorState.createWithContent(
          typeof value === "string"
            ? convertFromRaw(JSON.parse(value))
            : value
        )
      : EditorState.createEmpty()
  );

  useEffect(() => {
    const raw = convertToRaw(state.getCurrentContent());
    onChange && onChange(JSON.stringify(raw));      // отдаём строкой
  }, [state, onChange]);

  return (
    <Editor
      editorState={state}
      onEditorStateChange={setState}
      wrapperClassName="border rounded"
      editorStyle={{ minHeight: height, padding: 12 }}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "list",
          "link",
          "image",
          "embedded",        // ← вставка видео / iframe
          "history",
        ],
        embedded: {
          defaultSize: { width: "100%", height: "400" },
        },
      }}
    />
  );
}
