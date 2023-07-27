import { forwardRef, useImperativeHandle } from 'react'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import { Editor as TuiEditor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'

interface editorProps {
  className?: string
  forwardRef?: any
}

const Editor = forwardRef((props: editorProps, ref) => {
  useImperativeHandle(
    ref,
    () => {
      return {
        getInstance() {
          return props.forwardRef.current
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
        ref={props.forwardRef}
      />
    </div>
  )
})

export default Editor
