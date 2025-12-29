import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Temple from '../models/Temple.js';
import connectDatabase from '../config/database.js';

// Load env vars
dotenv.config();

// Sample temple data based on your existing temples
const temples = [
  {
    id: "mangaladevi-temple",
    name: "Mangaladevi Temple",
    location: "Mangalore",
    deity: "Goddess Mangaladevi",
    shortDescription: "The presiding deity of Mangalore",
    description: "Ancient temple dedicated to Goddess Mangaladevi, the city's namesake deity. Known for its historical significance and unique architectural style.",
    image: "/temples/mangaladevi.jpg",
    region: "Mangalore",
    openingHours: [
      { day: "Monday", hours: "6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM" },
      { day: "Tuesday", hours: "6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM" },
      { day: "Wednesday", hours: "6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM" },
      { day: "Thursday", hours: "6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM" },
      { day: "Friday", hours: "6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM" },
      { day: "Saturday", hours: "6:00 AM - 12:30 PM & 5:30 PM - 7:30 PM", isOpen: true },
      { day: "Sunday", hours: "6:00 AM - 12:00 PM & 1:00 PM - 7:30 PM" }
    ],
    faqs: [
      {
        question: "Do we have parking facility?",
        answer: "Yes, we have a dedicated parking area that can accommodate up to 50 vehicles. Parking is free for devotees."
      },
      {
        question: "What are the special poojas conducted?",
        answer: "Daily poojas include Abhisheka, Archana, and Aarti. Special poojas are conducted during festivals like Navaratri and Deepavali."
      },
      {
        question: "Is photography allowed inside the temple?",
        answer: "Photography is allowed in the outer areas but not inside the sanctum sanctorum. Please respect the temple's sacred atmosphere."
      }
    ],
    events: [
      {
        id: "navaratri-2024",
        title: "Navaratri Festival",
        date: "October 3-12, 2024",
        time: "6:00 AM - 9:00 PM",
        type: "festival",
        description: "Nine days of special celebrations with cultural programs, traditional music, and grand processions.",
        contact: "Temple Office: +91-824-2456789"
      },
      {
        id: "daily-abhisheka",
        title: "Daily Abhisheka",
        date: "Daily",
        time: "6:00 AM - 7:00 AM",
        type: "pooja",
        description: "Sacred bathing ritual of the deity with milk, honey, and holy water."
      }
    ],
    travelInfo: {
      fromJubileeBusStation: "18 Kms",
      fromShamirpet: "8 Kms",
      fromORRExit: "22 Kms"
    }
  },
  {
    id: "kadri-manjunatha-temple",
    name: "Kadri Manjunatha Temple",
    location: "Mangalore",
    deity: "Lord Manjunatha (Shiva)",
    shortDescription: "Historic hill temple devoted to Lord Shiva",
    description: "A historic hill temple devoted to Lord Manjunatha (Shiva), featuring ancient bronze statues and panoramic views of Mangalore city.",
    image: "/temples/kadri.png",
    region: "Mangalore"
  },
  {
    id: "kudroli-gokarnanatheshwara-temple",
    name: "Kudroli Gokarnanatheshwara Temple",
    location: "Mangalore",
    deity: "Lord Gokarnanatheshwara",
    shortDescription: "Famous for grand Dasara celebrations",
    description: "Famous for its grand Dasara celebrations and modern architecture with stunning illumination, dedicated to Lord Gokarnanatheshwara.",
    image: "/temples/kudroli.jpg",
    region: "Mangalore"
  },
  {
    id: "kateel-durgaparameshwari-temple",
    name: "Kateel Durgaparameshwari Temple",
    location: "near Mangalore",
    deity: "Goddess Durga",
    shortDescription: "River-island temple known for Yakshagana",
    description: "River-island temple of Goddess Durga, known for Yakshagana performances and serene location on the Nandini river.",
    image: "/temples/kateel.png",
    region: "Mangalore"
  },
  {
    id: "polali-rajarajeshwari-temple",
    name: "Polali Rajarajeshwari Temple",
    location: "near Mangalore",
    deity: "Goddess Rajarajeshwari",
    shortDescription: "Ancient temple with unique clay idol",
    description: "Ancient temple renowned for its clay idol of Goddess Rajarajeshwari and rich spiritual heritage spanning centuries.",
    image: "/temples/polali.jpg",
    region: "Mangalore"
  },
  {
    id: "ullal-durgaparameshwari-temple",
    name: "Ullal Durgaparameshwari Temple",
    location: "Ullal",
    deity: "Goddess Durga Parameshwari",
    shortDescription: "Coastal shrine of divine power",
    description: "Coastal shrine dedicated to Goddess Durga Parameshwari, known for its powerful spiritual energy and coastal location.",
    image: "/temples/ullal_durgaparameshwari.png",
    region: "Mangalore"
  },
  {
    id: "someshwara-temple-ullal",
    name: "Someshwara Temple, Ullal",
    location: "Ullal",
    deity: "Lord Shiva",
    shortDescription: "Seaside Shiva temple with ocean views",
    description: "Seaside Shiva temple overlooking the Arabian Sea, offering breathtaking sunset views and peaceful spiritual atmosphere.",
    image: "/temples/someshwara_ullal.png",
    region: "Mangalore"
  },
  {
    id: "venkataramana-temple-car-street",
    name: "Venkataramana Temple, Car Street",
    location: "Mangalore",
    deity: "Lord Venkataramana",
    shortDescription: "Popular Vaishnava temple at city center",
    description: "Popular Vaishnava temple at the city's spiritual center, known for daily rituals and vibrant festivals.",
    image: "/temples/venkataramana_car_street.png",
    region: "Mangalore"
  },
  {
    id: "anantheshwara-temple",
    name: "Anantheshwara Temple",
    location: "Udupi",
    deity: "Lord Ananteshwara",
    shortDescription: "Part of Udupi's sacred triad",
    description: "Ancient temple dedicated to Lord Ananteshwara, part of Udupi's sacred triad of temples with rich historical significance.",
    image: "/temples/anantheshwara.jpg",
    region: "Udupi"
  },
  {
    id: "ambalapady-mahakali-temple",
    name: "Ambalapady Mahakali Temple",
    location: "Udupi",
    deity: "Goddess Mahakali",
    shortDescription: "Twin shrines of power and protection",
    description: "Twin shrines of Goddess Mahakali and Lord Janardhana, known for powerful spiritual presence and traditional rituals.",
    image: "/temples/ambalapady.png",
    region: "Udupi"
  },
  {
    id: "guddattu-vinayaka-temple",
    name: "Guddattu Sri Vinayaka Temple",
    location: "Kundapura",
    deity: "Lord Ganesha",
    shortDescription: "Cave temple with self-manifested Ganesha",
    description: "Cave temple featuring self-manifested Ganesha idol, nestled in natural rock formations with mystical atmosphere.",
    image: "/temples/guddattu.jpg",
    region: "Kundapura"
  },
  {
    id: "anegudde-vinayaka-temple",
    name: "Anegudde Vinayaka Temple",
    location: "Udupi district",
    deity: "Lord Ganesha",
    shortDescription: "Revered wish-fulfilling shrine",
    description: "Revered wish-fulfilling shrine to Lord Ganesha, attracting devotees from across the region for blessings.",
    image: "/temples/anegudde_vinayaka.png",
    region: "Udupi"
  },
  {
    id: "brahmalingeshwara-temple",
    name: "Shri Brahmalingeshwara Temple",
    location: "Kundapura",
    deity: "Lord Shiva",
    shortDescription: "Peaceful Shiva temple in nature",
    description: "Dedicated to Lord Shiva, set amidst lush greenery offering tranquil atmosphere for meditation and worship.",
    image: "/temples/brahmalingeshwara.jpg",
    region: "Kundapura"
  },
  {
    id: "indrani-panchadurga-temple",
    name: "Shri Indrani Panchadurga Parameshwari Temple",
    location: "Udupi region",
    deity: "Goddess Durga",
    shortDescription: "Temple of five Durgas with ancient legends",
    description: "Temple of five Durgas, steeped in legend and known for powerful spiritual energy and ancient traditions.",
    image: "/temples/indrani_panchadurga.jpg",
    region: "Udupi"
  },
  {
    id: "chandramouleeshwara-temple",
    name: "Shri Chandramouleeshwara Temple",
    location: "Udupi",
    deity: "Lord Shiva",
    shortDescription: "Known for moonlight poojas",
    description: "Shiva temple known for moonlight poojas and serene evening rituals, offering unique spiritual experience.",
    image: "/temples/chandramouleeshwara.png",
    region: "Udupi"
  },
  {
    id: "laxmi-venkatesha-temple",
    name: "Shri Laxmi Venkatesha Temple",
    location: "Udupi",
    deity: "Lord Venkatesha",
    shortDescription: "Vaishnava temple for deep devotion",
    description: "Vaishnava temple known for deep devotion and cultural events, preserving ancient Bhakti traditions.",
    image: "/temples/laxmi_venkatesha.png",
    region: "Udupi"
  },
  {
    id: "vishweshwara-temple",
    name: "Shri Vishweshwara Temple",
    location: "Yellur, Udupi",
    deity: "Lord Shiva",
    shortDescription: "Known for healing powers",
    description: "Known for its healing powers and picturesque setting, attracting devotees seeking spiritual and physical wellness.",
    image: "/temples/vishweshwara.png",
    region: "Udupi"
  },
  {
    id: "gude-mahalingeshwara-temple",
    name: "Gude Mahalingeshwara Temple",
    location: "Herenjalu",
    deity: "Lord Shiva",
    shortDescription: "Ancient temple in serene forests",
    description: "Ancient Shiva temple nestled in serene forests, offering peaceful retreat for spiritual seekers.",
    image: "/temples/gude_mahalingeshwara.jpg",
    region: "Udupi"
  },
  {
    id: "mahisha-mardini-temple",
    name: "Shri Mahisha Mardini Temple",
    location: "Kadiyali",
    deity: "Goddess Durga",
    shortDescription: "Symbol of divine protection",
    description: "Powerful shrine of Goddess Durga as Mahisha Mardini, symbol of protection and victory over evil.",
    image: "/temples/mahisha_mardini.png",
    region: "Udupi"
  },

  {
    id: "anantha-padmanabha-temple",
    name: "Shri Anantha Padmanabha Temple",
    location: "Perdur",
    deity: "Lord Vishnu",
    shortDescription: "Ancient Vishnu temple with Dravidian style",
    description: "Ancient Vishnu temple with Dravidian architecture, featuring exquisite carvings and traditional rituals.",
    image: "/temples/anantha-padmanabha-perdoor-updated.png",
    region: "Udupi"
  },
  {
    id: "venugopala-temple-manipal",
    name: "Shri Venugopala Temple",
    location: "Manipal",
    deity: "Lord Krishna",
    shortDescription: "Krishna temple for youth devotion",
    description: "Krishna temple known for serene rituals and youth devotion, popular among students and families.",
    image: "/temples/venugopala.jpg",
    region: "Udupi"
  },
  {
    id: "venkataramana-temple-udupi",
    name: "Shri Venkataramana Temple",
    location: "Udupi",
    deity: "Lord Venkataramana",
    shortDescription: "Historic temple near Car Street",
    description: "Historic temple near the Car Street cluster, maintaining ancient Vaishnava traditions and rituals.",
    image: "/temples/venkataramana-manipal.png",
    region: "Udupi"
  },
  {
    id: "balarama-temple",
    name: "Shri Balarama Temple",
    location: "Vadabandeshwara, Malpe",
    deity: "Lord Balarama",
    shortDescription: "Coastal temple honoring Balarama",
    description: "Coastal temple honoring Lord Balarama, offering peaceful seaside atmosphere and traditional worship.",
    image: "/temples/balarama.png",
    region: "Udupi"
  },
  {
    id: "panatha-padmanabha-temple",
    name: "Shri Anantha Padmanabha Temple",
    location: "Paniyadi",
    deity: "Lord Padmanabha",
    shortDescription: "Ancient temple with Brahmin heritage",
    description: "Ancient temple with deep Shivalli Brahmin roots, preserving centuries-old traditions and rituals.",
    image: "/temples/anantha-padmanabha-paniyadi.png",
    region: "Udupi"
  }
];

const importData = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    await Temple.deleteMany();
    console.log('Data Destroyed...');

    // Insert new data
    await Temple.insertMany(temples);
    console.log('Data Imported...');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDatabase();
    await Temple.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
