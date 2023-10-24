interface weatherHour{
  fxTime: string,
  temp: string,
  icon: string,
  text: string,
  wind360: string,
  windDir:string,
  windScale: string,
  humidty: string,
  pop: string,
  pressure: string,
  cloud: string,
  dew: string
}

interface WeatherDay {  
  fxDate: string;  
  sunrise: string;  
  sunset: string;  
  moonrise: string;  
  moonset: string;  
  moonPhase: string;  
  moonPhaseIcon: string;  
  tempMax: string;  
  tempMin: string;  
  iconDay: string;  
  textDay: string;  
  iconNight: string;  
  textNight: string;  
  wind360Day: string;  
  windDirDay: string;  
  windScaleDay: string;  
  windSpeedDay: string;  
  wind360Night: string;  
  windDirNight: string;  
  windScaleNight: string;  
  windSpeedNight: string;  
  humidity: string;  
  precip: string;  
  pressure: string;  
  vis: string;  
  cloud: string;  
  uvIndex: string;  
}

interface weatherWaring {  
  id: string;  
  sender: string;  
  pubTime: string;  
  title: string;  
  startTime: string;  
  endTime: string;  
  status: string;  
  level: string;  
  severity: string;  
  severityColor: string;  
  type: number;  
  typeName: string;  
  urgency: string;  
  certainty: string;  
  text: string;  
  related: string;  
} 

interface livingIndex {  
  date: string;  
  type: string;  
  name: string;  
  level: string;  
  category: string;  
  text: string;  
}  

interface AirQuality {  
  pubTime: string;  
  aqi: string;  
  level: string;  
  category: string;  
  primary: string;  
  pm10: string;  
  pm2p5: string;  
  no2: string;  
  so2: string;  
  co: string;  
  o3: string;  
}

export type {
  weatherHour,
  WeatherDay,
  weatherWaring,
  livingIndex,
  AirQuality
}