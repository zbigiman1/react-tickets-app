import Layout from '@/layout/Layout'
import TicketDetails from '@/views/TicketDetails'
import TicketList from '@/views/TicketList'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<TicketList />} />
          <Route path="/ticket/:id" element={<TicketDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
