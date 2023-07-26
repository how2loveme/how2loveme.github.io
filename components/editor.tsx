import { forwardRef, lazy, Suspense, useImperativeHandle, useRef } from 'react'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'

interface editorProps {
  className?: string
  ref?: any
}
const TuiEditor = lazy(() => import('../components/core/editor'))

const Editor = forwardRef((props: editorProps, ref) => {
  const editorRef = useRef()
  useImperativeHandle(
    ref,
    () => {
      return {
        getInstance() {
          return editorRef.current
        },
      }
    },
    []
  )
  return (
    <div className={props.className}>
      <Suspense fallback={<div>loading...</div>}>
        <TuiEditor
          language={'ko'}
          plugins={[colorSyntax]}
          height={'500px'}
          ref={editorRef}
        />
      </Suspense>
    </div>
  )
})

export default Editor
