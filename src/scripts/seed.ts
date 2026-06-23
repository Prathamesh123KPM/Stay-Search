import { addDoc, collection, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const MOCK_PROPERTIES = [
  {
    id: 'prop-1',
    title: 'A Coconut Valley Resort',
    location: 'Kelva Beach, Palghar',
    description: 'A nature-centric beach resort surrounded by coconut trees and greenery. Ideal for families, group picnics, weekend getaways and peaceful stays near Kelva Beach.',
    price: 3500,
    rating: 4.8,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Lawn & Garden', 'Indoor Games', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-2',
    title: 'Tandel Resort',
    location: 'Kelva Beach, Palghar',
    description: 'Family-run resort known for traditional hospitality, spacious rooms and a wonderful family-friendly atmosphere near the beach.',
    price: 3200,
    rating: 4.6,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Garden Area', 'Parking'],
    images: ['https://r1imghtlak.mmtcdn.com/f23b0de45a9f11e9b13f0242ac110004.jpeg', 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-3',
    title: 'Kelva Beach Resort',
    location: 'Kelva Beach, Palghar',
    description: 'Beautiful classic beachside resort offering open spaces, lush green lawns, kids activities and easy access to the Arabian Sea.',
    price: 4500,
    rating: 4.7,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Cottages', 'Kids Area'],
    images: ['https://r1imghtlak.mmtcdn.com/9f1c44b0-7561-44a4-bc0b-2cdad4437cc9.jpg', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-4',
    title: 'Baadal Pani Beach Resort',
    location: 'Kelva Beach, Palghar',
    description: 'Experience the soothing sound of the waves at Baadal Pani. Famous for its cozy cottages, swimming pool, and peaceful surroundings.',
    price: 3800,
    rating: 4.6,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Barbecue', 'Cottages'],
    images: ['https://r1imghtlak.mmtcdn.com/f23b0de45a9f11e9b13f0242ac110004.jpeg', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-5',
    title: 'Raj Resort',
    location: 'Mangelwada, Kelva Beach',
    description: 'A popular premium resort offering relaxing stays with modern comfort and rustic charm, excellent amenities including a well-maintained pool.',
    price: 4000,
    rating: 4.5,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Indoor Games', 'Couple Friendly'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-6',
    title: 'Betel Leaf Resort',
    location: 'Kaulghar Road, Kelva',
    description: 'Comfortable premium stay with pool and outdoor dining amidst lush nature, just a 5-minute walk from the beach.',
    price: 4200,
    rating: 4.5,
    type: 'Villa',
    amenities: ['Free WiFi', 'Swimming Pool', 'AC', 'Outdoor Dining', 'Near Beach'],
    images: ['https://images.unsplash.com/photo-1584132967334-10e028b03046?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-7',
    title: 'Blue Roof Sea Side',
    location: 'Kelva Beach, Palghar',
    description: 'Premier property located right at Kelva Beach offering a perfect blend of luxury and nature with spectacular sea views.',
    price: 4800,
    rating: 4.4,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Modern Rooms', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1448375003491-6b2b77a56133?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-8',
    title: 'Anand Residency',
    location: 'Shitladevi Temple Area, Kelva',
    description: 'Mid-range family stay close to all local attractions with a beautiful swimming pool and authentic restaurant.',
    price: 2800,
    rating: 4.2,
    type: 'Homestay',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Breakfast', 'Parking'],
    images: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-9',
    title: 'The Mist Valley Villa',
    location: 'Khandala, Lonavala',
    description: 'A luxurious 4BHK villa offering breathtaking valley views, a private infinity pool, and a beautifully landscaped lawn.',
    price: 15000,
    rating: 4.9,
    type: 'Villa',
    amenities: ['Free WiFi', 'Swimming Pool', 'AC', 'Lawn & Garden', 'Kitchen', 'Valley View'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString(),
    isFeatured: true
  },
  {
    id: 'prop-10',
    title: 'Cloud 9 Hill Resort',
    location: 'Tungarli, Lonavala',
    description: 'Perched on a hilltop, Cloud 9 offers cozy rooms, an outdoor swimming pool, and an open-air restaurant serving delicious food.',
    price: 6500,
    rating: 4.7,
    type: 'Resort',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'AC', 'Hill View', 'Parking'],
    images: ['https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString(),
    isFeatured: true
  },
  {
    id: 'prop-11',
    title: 'Whispering Pines Cabin',
    location: 'Gold Valley, Lonavala',
    description: 'A rustic wooden cabin nestled among pine trees. Perfect for couples looking for a romantic and secluded retreat in the hills.',
    price: 5800,
    rating: 4.8,
    type: 'Cabin',
    amenities: ['Free WiFi', 'AC', 'Kitchen', 'Barbecue', 'Private Garden', 'Pet Friendly'],
    images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString(),
    isFeatured: true
  },
  {
    id: 'prop-12',
    title: 'Earthy Stone Villa',
    location: 'Lonavala East, Lonavala',
    description: 'A beautifully crafted stone villa featuring traditional architecture, spacious balconies, a private plunge pool, and local home-cooked meals.',
    price: 12500,
    rating: 4.6,
    type: 'Villa',
    amenities: ['Free WiFi', 'Plunge Pool', 'AC', 'Home Cooked Food', 'Balcony', 'Indoor Games'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'],
    availability: true,
    ownerId: 'admin_user_id',
    createdAt: new Date().toISOString(),
    isFeatured: true
  }
];

export async function seedDatabase() {
  console.log("Starting database seeding...");
  try {
    const propertiesRef = collection(db, 'properties');
    const existingSnap = await getDocs(propertiesRef);
    for (const d of existingSnap.docs) {
      await deleteDoc(doc(db, 'properties', d.id));
    }
    for (const prop of MOCK_PROPERTIES) {
      const { id, ...propData } = prop;
      await addDoc(propertiesRef, propData);
      console.log(`Added ${propData.title}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
