import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { getCoordinates, getWeatherData, saveWeatherData, getWeatherDashboardData, sendWeatherEmail } from './service';

const app = express();
const port = 8000; //

app.use(express.json());
app.use(bodyParser.json());


app.post('/api/SaveWeatherMapping', async (req, res) => {
  const cities = req.body;
  try {
    for (const city of cities) {
      const coordinates = await getCoordinates(city);
      if (coordinates) {
        const weatherData = await getWeatherData(coordinates);
        if (weatherData) {
          await saveWeatherData(city, weatherData, coordinates);
        }
      }
    }
    res.status(200).send({ message: 'Weather data saved successfully' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while saving weather data' });
  }
});


app.get('/api/weatherDashboard', async (req, res) => {
  try {
    const city = req.query.city as string | undefined;
    const weatherData = await getWeatherDashboardData(city);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather dashboard data:', error);
    res.status(500).json({ error: 'An error occurred while fetching weather dashboard data' });
  }
});


app.post('/api/mailWeatherData', async (req, res) => {
  try {
    const city = req.body.city as string | undefined;
    const weatherData = await getWeatherDashboardData(city);
    await sendWeatherEmail(weatherData);
    res.status(200).json({ message: 'Email sent using nodemailer' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending email' });
  }
});


app.listen(port, () => {
  console.log(` Hii we are comfortable in NodeJS `);

})