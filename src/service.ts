import axios from 'axios';
import { Weather } from './weatherModel';
import nodemailer from 'nodemailer';

interface City {
  city: string;
  country: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherDashboardResponse {
  id: number;
  city: string;
  country: string;
  date: Date;
  weather: string;
}

const GEOCODING_API_URL = 'https://api.api-ninjas.com/v1/geocoding';
const WEATHER_API_URL = 'https://weatherapi-com.p.rapidapi.com/current.json';
const GEOCODING_API_KEY = 'RX7URWV+CyPnhv4ncqEVow==gAhjjUjjcGvEDv9O';
const WEATHER_API_KEY = 'ea773c1103mshda48acff4368e49p1e1b38jsnff8ba48770bf';

export const getCoordinates = async (city: City): Promise<Coordinates | null> => {
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        city: city.city,
        country: city.country,
      },
      headers: {
        'X-Api-Key': GEOCODING_API_KEY,
      },
    });
console.log(response.data);
    if (response.data && response.data.length > 0) {
      const { latitude, longitude } = response.data[0];
      return { latitude, longitude };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching coordinates `, error);
    return null;
  }
};

export const getWeatherData = async (coordinates: Coordinates): Promise<string | null> => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: `${coordinates.latitude},${coordinates.longitude}`,
      },
      headers: {
        'X-RapidAPI-Key': WEATHER_API_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
      },
    });

    if (response.data && response.data.current && response.data.current.condition) {
      return response.data.current.condition.text;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching weather data:`, error);
    return null;
  }
};

export const saveWeatherData = async (city: City, weatherData: string, coordinates: Coordinates) => {
  try {
    await Weather.create({
      city: city.city,
      country: city.country,
      weather: weatherData,
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    });
  } catch (error) {
    console.error(`Error saving weather data for city ${city.city}:`, error);
  }
};



export const getWeatherDashboardData = async (city?: string): Promise<WeatherDashboardResponse[]> => {
  try {
    let weatherData;
    if (city) {
      weatherData = await Weather.findAll({
        where: {
          city: city,
        },
        order: [['time', 'DESC']], 
      });
    } else {
      weatherData = await Weather.findAll({
        attributes: ['id', 'city', 'country', 'time', 'weather'],
        group: ['id', 'city', 'country', 'time', 'weather'], 
        order: [['time', 'DESC']], 
      });
    }

    return weatherData.map((data: any) => ({
      id: data.id,
      city: data.city,
      country: data.country,
      date: data.time,
      weather: data.weather,
    }));
  } catch (error) {
    console.error('Error fetching weather dashboard data:', error);
    throw new Error('An error occurred while fetching weather dashboard data');
  }
};


export const sendWeatherEmail = async (weatherData: WeatherDashboardResponse[]) => {
  const htmlTable = HtmlTable(weatherData);
  await sendEmail(htmlTable);
};

const HtmlTable = (weatherData: WeatherDashboardResponse[]): string => {
  return `
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>ID</th>
        <th>City</th>
        <th>Country</th>
        <th>Date</th>
        <th>Weather</th>
      </tr>
      ${weatherData.map(({ id, city, country, date, weather }) => `
        <tr>
          <td>${id}</td>
          <td>${city}</td>
          <td>${country}</td>
          <td>${date}</td>
          <td>${weather}</td>
        </tr>
      `).join('')}
    </table>
  `;
};

const sendEmail = async (htmlContent: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'sdds3399@gmail.com',
        pass: 'evvx cxpw kmyl wnh',
      },
    });

    await transporter.sendMail({
      from: 'sdds3399@gmail.com',
      to: 'vighne3333@gmail.com',
      subject: 'Weather Data',
      html: htmlContent,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('An error occurred while sending email');
  }
};