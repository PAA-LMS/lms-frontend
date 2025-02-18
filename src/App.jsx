import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Apps() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <h1>Welcome to the Learning Management System (LMS) Project</h1>
                <p>The Learning Management System (LMS) project is a web application designed to facilitate online learning and course management. It provides a platform for educators to create and manage courses, and for students to access and participate in those courses. With features such as content delivery, assessments, and collaboration tools, the LMS project aims to enhance the learning experience for both educators and students.</p>
            </div>
        </>
    )
}

export default Apps
