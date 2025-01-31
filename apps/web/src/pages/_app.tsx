import '../styles/index.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'tippy.js/dist/tippy.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import MetaTags from '@components/Common/MetaTags'
import { bloomer } from '@lenstube/browser'
import { AUTH_ROUTES } from '@lenstube/constants'
import useAuthPersistStore from '@lib/store/auth'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect } from 'react'

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))

const App = ({ Component, pageProps }: AppProps) => {
  const { pathname, replace, asPath } = useRouter()
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )

  useEffect(() => {
    if (!selectedChannelId && AUTH_ROUTES.includes(pathname)) {
      replace(`/auth?next=${asPath}`)
    }
  }, [selectedChannelId, pathname, asPath, replace])

  return (
    <>
      <MetaTags />
      <Suspense fallback={<FullPageLoader />}>
        <Providers>
          <style jsx global>{`
            body {
              font-family: ${bloomer.style.fontFamily};
            }
          `}</style>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </Suspense>
    </>
  )
}

export default App
