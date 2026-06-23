export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Coordinates mapping for Maharashtra tourist hubs and destinations
const DESTINATION_COORDS: Record<string, Coordinates> = {
  'kelva': { latitude: 19.6200, longitude: 72.7300 }, // Kelva Beach
  'palghar': { latitude: 19.6936, longitude: 72.7655 },
  'dahanu': { latitude: 19.9723, longitude: 72.7275 },
  'jawhar': { latitude: 19.9051, longitude: 73.2285 },
  'bordi': { latitude: 20.1171, longitude: 72.7237 },
  'saphale': { latitude: 19.5786, longitude: 72.8228 },
  'wada': { latitude: 19.6548, longitude: 73.1386 },
  'lonavala': { latitude: 18.7541, longitude: 73.4024 },
  'mahabaleshwar': { latitude: 17.9258, longitude: 73.6601 },
  'alibaug': { latitude: 18.6584, longitude: 72.8777 },
  'matheran': { latitude: 18.9840, longitude: 73.2678 },
  'igatpuri': { latitude: 19.6936, longitude: 73.5510 },
  'karjat': { latitude: 18.9102, longitude: 73.3282 },
  'mangelwada': { latitude: 19.6200, longitude: 72.7300 }, // Part of Kelva
  'kaulghar': { latitude: 19.6200, longitude: 72.7300 },
  'shitladevi': { latitude: 19.6200, longitude: 72.7300 },
  'mumbai': { latitude: 19.0760, longitude: 72.8777 } // Fallback
};

export function getPropertyCoordinates(locationStr: string): Coordinates {
  const normalized = locationStr.toLowerCase();
  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  return DESTINATION_COORDS.mumbai; // Fallback to Mumbai center
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
