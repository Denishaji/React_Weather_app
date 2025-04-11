import React, { useState } from 'react';
import { Container, Form, Row, Col, Button, Card, Alert } from 'react-bootstrap';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherApp = () => {
  const [weatherCards, setWeatherCards] = useState([]); // stores weather info for each searched city
  const [error, setError] = useState(null); // to show error for invalid city
  const [bgClass, setBgClass] = useState("clear"); // sets background based on weather

  const handleSubmit = async (event) => {
    event.preventDefault();
    const city = event.target.elements.city.value.trim();

    if (!city) return;

    await fetchWeatherByCity(city);
    event.target.reset(); // clear input after search
  };

  // fetch weather for a given city
  const fetchWeatherByCity = async (city) => {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();

      setWeatherCards(prev => [...prev, data]);
      setBgClass(data.weather[0].main.toLowerCase()); // change background based on weather
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // remove card when "Remove" button is clicked
  const handleRemove = (id) => {
    setWeatherCards(prev => prev.filter(card => card.id !== id));
  };

  return (
    <div className={`weather-app ${bgClass}`}>
      <Container className="my-5 text-center">
        <h2 className="mb-4">⛅ React Weather App</h2>

        {/* form for entering city */}
        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-center align-items-center mb-3">
            <Col xs={12} md={6}>
              <Form.Control type="text" name="city" placeholder="Enter city name..." />
            </Col>
            <Col xs="auto" className="mt-2 mt-md-0">
              <Button variant="primary" type="submit">Search</Button>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* card layout for each city searched */}
        <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
          {weatherCards.map((data) => (
            <Card
              key={data.id}
              className="weather-card shadow text-center"
              style={{ width: '100%', maxWidth: '350px' }}
            >
              <Card.Body>
                <Card.Title className="weather-title">
                  {data.name}, {data.sys.country}
                </Card.Title>

                <Card.Text className="text-start">
                  <div className="text-center mb-2">
                    <img
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                      alt="weather icon"
                    />
                  </div>
                  <div><strong>Temperature:</strong> {data.main.temp.toFixed(1)} °C</div>
                  <div><strong>Condition:</strong> {data.weather[0].description}</div>
                  <div><strong>Wind Speed:</strong> {data.wind.speed} m/s</div>
                  <div><strong>Humidity:</strong> {data.main.humidity}%</div>
                  <div><strong>Updated:</strong> {new Date(data.dt * 1000).toLocaleString()}</div>
                </Card.Text>

                <Button variant="danger" onClick={() => handleRemove(data.id)}>Remove</Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default WeatherApp;



