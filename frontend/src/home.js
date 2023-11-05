import { Button, Card } from 'react-bootstrap';
import './App.css';
import { useParams } from 'react-router-dom';

const Home = ({navigate}) => {
    const cards = [
        {
            name: "Courses",
            description: "View your courses",
            destination: '/courses'
        },
        {
            name: "Score",
            description: "View your score",
            destination: '/scores'
        },
        {
            name: "Leaderboard",
            description: "View the leaderboard",
            destination: '/leaderboard'
        },
        {
            name: "Settings",
            description: "Profile Settings",
            destination: '/profilesettings'
        }
    ];

    const { userName } = useParams();

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {cards.map((item) => (
                <Card className='cardStyle' key={item.name} onClick={() => navigate(item.destination)}>
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