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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mangaladevi_Temple_Mangalore_2.jpg/1024px-Mangaladevi_Temple_Mangalore_2.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Kadri_temple_entrance_mangalore.jpg/1024px-Kadri_temple_entrance_mangalore.jpg",
    region: "Mangalore",
    openingHours: [],
    faqs: [],
    events: [],
    travelInfo: {
      fromJubileeBusStation: "12 Kms",
      fromShamirpet: "15 Kms",
      fromORRExit: "20 Kms"
    }
  },
  {
    id: "kudroli-gokarnanatheshwara-temple",
    name: "Kudroli Gokarnanatheshwara Temple",
    location: "Mangalore",
    deity: "Lord Gokarnanatheshwara",
    shortDescription: "Famous for grand Dasara celebrations",
    description: "Famous for its grand Dasara celebrations and modern architecture with stunning illumination, dedicated to Lord Gokarnanatheshwara.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Gokarnatheshwara_Temple_7042008.jpg/1024px-Gokarnatheshwara_Temple_7042008.jpg",
    region: "Mangalore",
    openingHours: [],
    faqs: [],
    events: [],
    travelInfo: {
      fromJubileeBusStation: "10 Kms",
      fromShamirpet: "12 Kms",
      fromORRExit: "18 Kms"
    }
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
