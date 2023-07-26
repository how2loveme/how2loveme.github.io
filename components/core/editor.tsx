import { Editor, EditorProps } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'

interface TuiEditorProps extends EditorProps {
  ref: any
}

const TuiEditor = (props: TuiEditorProps) => {
  return <Editor {...props}></Editor>
}

export default TuiEditor
