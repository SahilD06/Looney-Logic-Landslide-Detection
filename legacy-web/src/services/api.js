// api.js - Centralized API calls

const METEO_URL = import.meta.env.VITE_OPEN_METEO_API || 'https://api.open-meteo.com/v1/forecast';
const EONET_URL = import.meta.env.VITE_NASA_EONET_API || 'https://eonet.gsfc.nasa.gov/api/v3/events';

// NER Bounding Box (approx): 88.5,21.5,97.5,29.5
export const NER_BBOX = '88.5,21.5,97.5,29.5';

/**
 * Fetch live soil moisture and rainfall for a specific coordinate.
 */
export const fetchLiveTelemetry = async (lat, lon) => {
  try {
    const url = `${METEO_URL}?latitude=${lat}&longitude=${lon}&hourly=rain,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    
    // Extract the most recent hourly data (index 0)
    return {
      rain_24h_sum: data.hourly.rain.slice(0, 24).reduce((a, b) => a + b, 0).toFixed(1),
      current_rain: data.hourly.rain[0],
      soil_moisture: data.hourly.soil_moisture_0_to_1cm[0]
    };
  } catch (error) {
    console.error("Failed to fetch live telemetry:", error);
    return null;
  }
};

/**
 * Fetch active NASA EONET events within the NER bounding box.
 */
export const fetchNasaEvents = async () => {
  try {
    const res = await fetch(`${EONET_URL}?status=open&bbox=${NER_BBOX}&category=severeStorms,floods,landslides`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    console.error("Failed to fetch NASA events:", error);
    return [];
  }
};
