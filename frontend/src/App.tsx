import { Routes, Route, Navigate } from "react-router-dom"
import { AppProvider } from "./store/AppStore"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import UploadPage from "./pages/UploadPage"
import ChatPage from "./pages/ChatPage"

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
