import '@/styles/globals.css'
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <HMSRoomProvider>
        <Component {...pageProps} />
        <ToastContainer autoClose={2000} />
      </HMSRoomProvider>
    </>
  )
}
