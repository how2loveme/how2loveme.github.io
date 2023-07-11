import { Editor as TuiEditor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'

export default function Editor({ className }: { className?: string }) {
  return (
    <div className={className}>
      <TuiEditor language={'ko'} plugins={[colorSyntax]} height={'500px'} />
    </div>
  )
}
