import { Button, Card } from 'react-bootstrap';

const Home = ({navigate}) => {
    const cardStyle = { 
        width: '40rem', 
        height: '25rem', 
        margin: '10px',
        backgroundColor: 'wheat', 
        borderRadius: '30px',
        boxShadow:'0px 20px 30px rgba(0, 0, 0, 0.2)'
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {[1, 2, 3, 4].map((item) => (
                <Card style={cardStyle} key={item}>
                    <Card.Body>
                        <Card.Title>Card {item}</Card.Title>
                        <Card.Text>
                        This is card number {item}.
                        </Card.Text>
                        <Button onClick={() => navigate('/settings')}>
                        Go to Settings
                        </Button>
                    </Card.Body>
                </Card>
            ))}
            
        </div>
    )
}

export default Home;