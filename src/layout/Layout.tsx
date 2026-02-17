import type { PropsWithChildren } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </>
  )
}
