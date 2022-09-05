import React, { useState } from "react";
import {convertToRaw, EditorState} from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import style from './ArticleEditor.module.css'

export default function ArticleEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  // console.log(editorState)
  return (
    // <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName={style.editor}
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        placeholder="请输入内容..."
        onBlur={
          () => {
            console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
          }
        }
    />
    // </div>
  );
}
