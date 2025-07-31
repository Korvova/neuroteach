import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RichEditor({ editorState, onChange, height = 200 }) {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onChange}
      wrapperClassName="border rounded"
      editorStyle={{ minHeight: height, padding: 12 }}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "list",
          "link",
          "image",
          "embedded",
          "history",
        ],
        embedded: {
          defaultSize: { width: "100%", height: "400" },
        },
      }}
    />
  );
}