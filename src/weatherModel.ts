import { DataTypes, Model } from 'sequelize';
import sequelize from './pgConfig';

interface WeatherAttributes {
  id?: number;
  city: string;
  country: string;
  weather: string;
  time?: Date;
  longitude: number;
  latitude: number;
}

class Weather extends Model<WeatherAttributes> implements WeatherAttributes {
  public id!: number;
  public city!: string;
  public country!: string;
  public weather!: string;
  public time!: Date;
  public longitude!: number;
  public latitude!: number;

  // You can define additional methods and associations here
}

Weather.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weather: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'weatherdata',
    timestamps: false,
  }
);

export { Weather };
