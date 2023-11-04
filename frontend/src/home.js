import { Button, Card } from 'react-bootstrap';
import './App.css';

const Home = ({navigate}) => {
    const cards = [
        {
            name: "Courses",
            description: "View your courses"
        },
        {
            name: "Score",
            description: "View your score"
        },
        {
            name: "Leaderboard",
            description: "View the leaderboard"
        },
        {
            name: "Settings",
            description: "Profile Settings"
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {cards.map((item) => (
                <Card className='cardStyle' key={item} onClick={() => navigate('/settings')}>
                    <Card.Body>
                        <Card.Title style={{fontSize: '40px'}}>{item.name}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
            
        </div>
    )
}

export default Home;