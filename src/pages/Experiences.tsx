import React from 'react';
import { motion } from 'motion/react';
import { Camera, Coffee, Mountain, Users } from 'lucide-react';

const experiencesList = [
  {
    title: 'Tribal Village Tour & Warli Art',
    image: 'https://www.tusktravel.com/blog/wp-content/uploads/2021/02/Nagaland-Tribal.jpg',
    desc: 'Visit an authentic tribal village, learn about their lifestyle, and participate in a genuine Warli art painting session with local artisans.',
    icon: <Users className="w-5 h-5 text-orange-400" />
  },
  {
    title: 'Fort Treks & Sunrise Hikes',
    image: 'https://assets.simplotel.com/simplotel/image/upload/x_0,y_63,w_1198,h_674,r_0,c_crop,q_80,fl_progressive/w_1198,f_auto,c_fit/sterling-nature-trails-sajan/Tree_Top_AC_Room_-_Sajan',
    desc: 'Challenge yourself with guided treks to Sahyadri forts like Tandulwadi or Asherigad. Experience breathtaking sunrises and panoramic views of the district.',
    icon: <Mountain className="w-5 h-5 text-green-400" />
  },
  {
    title: 'Beach Camping & Coastal Feasts',
    image: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0a/b0/14/17.jpg',
    desc: 'Savor authentic Maharashtrian coastal cuisine and experience premium beach camping under the stars by the ocean.',
    icon: <Coffee className="w-5 h-5 text-yellow-400" />
  },
  {
    title: 'Heritage & Photography Walks',
    image: 'https://images.unsplash.com/photo-1506744626753-1fa7673e022b?q=80&w=1200&auto=format&fit=crop',
    desc: 'Explore the Portuguese heritage of the northern Konkan coast. Walk through ancient fort ruins, stone archways, and capture the rustic beauty of coastal history.',
    icon: <Camera className="w-5 h-5 text-blue-400" />
  }
];

export default function Experiences() {
  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#0c1a12]">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
           <div className="inline-flex items-center gap-2 py-1 px-4 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Activities</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">Local Experiences</h1>
           <p className="text-white/60 text-lg">
             Go beyond the stay. Dive deep into the culture, nature, and flavors of Palghar with our curated experiences.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {experiencesList.map((exp, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="group relative h-[450px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
             >
               <img 
                 src={exp.image} 
                 alt={exp.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/95 via-[#0c1a12]/50 to-transparent pointer-events-none" />
               
               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {exp.icon}
                  </div>
                 <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{exp.title}</h3>
                   <p className="text-white/70 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto overflow-hidden">
                     {exp.desc}
                   </p>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
         
         <div className="mt-16 text-center">
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors shadow-lg shadow-white/5">
                Request Custom Itinerary
            </button>
         </div>
       </div>
    </div>
  );
}
