import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SignupPage from './pages/signupPage/signup.jsx'
import LoginPage from './pages/loginPage/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SignupPage />
  </StrictMode>,
)
