import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './pages/signupPage/signup.jsx';
import LoginPage from './pages/loginPage/login.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/Signup" element={<SignupPage />} />
            </Routes>
        </Router>
    );
}

export default App;
