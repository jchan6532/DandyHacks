import './App.css';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

const Courses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/courses')
            .then(res=> res.json())
            .then(data => setCourses(data))
            .catch(error => console.error());
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {courses.map((item) => (
                <Card className='cardStyle' key={item.coursename} onClick={()=> alert("clicked")}>
                    <Card.Body>
                        <Card.Title style={{fontSize: '40px'}}>{item.coursename}</Card.Title>
                        <Card.Text>
                            {item.topics.map((topic) => (
                                <li>{topic}</li>
                            ))}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
            
        </div>
    );
}

export default Courses;