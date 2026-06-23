import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { propertyService, Property } from '../../services/propertyService';
import { HomeStayCard } from './FeaturedStays';

export default function LonavalaStays() {
  const { toggleFavorite, isFavorite } = useUser();
  const [stays, setStays] = React.useState<Property[]>(() => {
    const data = propertyService.getLocalPropertiesSync();
    return data.filter(p => p.location.toLowerCase().includes('lonavala')).slice(0, 8);
  });
  const [loading, setLoading] = React.useState(() => {
    return propertyService.getLocalPropertiesSync().filter(p => p.location.toLowerCase().includes('lonavala')).length === 0;
  });

  React.useEffect(() => {
    const fetchStays = async () => {
      try {
        const data = await propertyService.getAllProperties();
        const lonavalaStays = data.filter(p => p.location.toLowerCase().includes('lonavala'));
        setStays(lonavalaStays.slice(0, 8));
      } catch (error) {
        console.error("Failed to load Lonavala stays", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  return (
    <section className="py-16 relative z-10 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900">Popular stays in Lonavala</h2>
            <p className="text-gray-500 text-xs mt-1">Stunning getaways, cabins and luxury villas nestled in the hills.</p>
          </div>
          <Link to="/search?dest=Lonavala" className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1">
            Explore Lonavala stays &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading stays...</div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stays.map((stay, idx) => (
              <HomeStayCard
                key={stay.id}
                stay={stay}
                idx={idx}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">No properties available in Lonavala.</div>
        )}
      </div>
    </section>
  );
}
