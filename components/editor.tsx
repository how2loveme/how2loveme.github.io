'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import { Editor as TuiEditor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'

interface editorProps {
  className?: string
}

const Editor = forwardRef((props: editorProps, ref) => {
  const editorRef = useRef(null)
  useImperativeHandle(
    ref,
    () => {
      return {
        getValue() {
          return editorRef.current.getInstance().getHTML()
        },
      }
    },
    []
  )
  return (
    <div className={props.className}>
      <TuiEditor
        usageStatistics={false}
        height={'500px'}
        initialValue={''}
        previewStyle={'tab'}
        previewHighlight={true}
        initialEditType={'wysiwyg'}
        language={'ko'}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
          // ['scrollSync']
        ]}
        hideModeSwitch={true}
        placeholder={'내용을 입력하세요'}
        plugins={[colorSyntax]}
        ref={editorRef}
      />
    </div>
  )
})

export default Editor
