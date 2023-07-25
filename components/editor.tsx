import { Editor as TuiEditor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface editorProps {
  className?: string
}

const Editor = forwardRef((props: editorProps, ref) => {
  const editorRef = useRef<TuiEditor>()
  useImperativeHandle(
    ref,
    () => {
      return {
        getInstance() {
          debugger
          return editorRef.current.getInstance()
        },
        getValue() {
          debugger
          return editorRef.current.getInstance().getHTML()
        },
      }
    },
    []
  )
  return (
    <div className={props.className}>
      <TuiEditor
        language={'ko'}
        plugins={[colorSyntax]}
        height={'500px'}
        ref={editorRef}
      />
    </div>
  )
})
export default Editor
