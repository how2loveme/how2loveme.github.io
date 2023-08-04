import '../styles/global.css'

import { ModalContextProvider } from '../components/modal'
import Layout from "../components/layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Layout>
          {children}
        </Layout>
        {/*<ModalContextProvider>*/}
        {/*<>{children}</>*/}
        {/*</ModalContextProvider>*/}
      </body>
    </html>
  )
}
