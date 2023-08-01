import '../styles/global.css'
import { AppProps } from 'next/app'
import { ModalContextProvider } from '../components/modal'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalContextProvider>
      <Component {...pageProps} />
    </ModalContextProvider>
  )
}
