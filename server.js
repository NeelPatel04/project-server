const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

let dest = [    
    {
        "_id":1,
        "img":"images/greece.jpg",
        "country":"Greece",
        "city":"Santorini",
        "cost":2051,
        "description":"Discover the sun-kissed islands of Greece, where azure waters meet white-washed cliffs. From Santorini's iconic sunsets to Athens' ancient wonders, experience Mediterranean magic."
    },

    {
        "_id":2,
        "img":"images/dubai.jpg",
        "country":"United Arab Emirates",
        "city":"Dubai",
        "cost":2023,
        "description":"Discover the UAE's dazzling fusion of tradition and innovation - from Dubai's soaring Burj Khalifa to Abu Dhabi's serene Sheikh Zayed Mosque. Experience desert adventures, luxury shopping, and Arabian hospitality in this Middle Eastern gem."
    },

    {
        "_id":3,
        "img":"images/switzerland.jpg",
        "country":"Switzerland",
        "city":"Interlaken",
        "cost":3650,
        "description":"Experience Switzerland's breathtaking Alpine majesty - crystal-clear lakes, snow-capped peaks, and charming villages. From Interlaken's adventure sports to Lucerne's medieval charm, discover chocolate-box perfection."
    },

    {
        "_id":4,
        "img":"images/paris.jpg",
        "country":"France",
        "city":"Paris",
        "cost":2450,
        "description":"Experience the City of Light's timeless romance with Eiffel Tower sunsets, Seine River cruises, and charming Montmartre streets. Savor buttery croissants at hidden patisseries, explore the Louvre's masterpieces, and fall in love with Parisian elegance and joie de vivre."
    },

    {
        "_id":5,
        "img":"images/beijing.jpg",
        "country":"China",
        "city":"Beijing",
        "cost":2100,
        "description":"Discover Beijing's majestic blend of ancient imperial grandeur and modern dynamism. Walk the Great Wall's winding battlements, explore the Forbidden City's crimson palaces, savor Peking duck in hidden hutongs, and experience China's rich cultural heartbeat in this historic capital."
    },

    {
        "_id":6,
        "img":"images/tokyo.jpg",
        "country":"Japan",
        "city":"Tokyo",
        "cost":2800,
        "description":"Experience Tokyo's electrifying fusion of ancient tradition and futuristic innovation. From serene Sensoji Temple to neon-lit Shibuya Crossing, savor worldclass sushi, explore hidden alleyway izakayas, and discover cherry blossom magic in this vibrant metropolis."
    },

    {
        "_id":7,
        "img":"images/rome.jpg",
        "country":"Italy",
        "city":"Rome",
        "cost":2500,
        "description":"Experience Eternal Rome's timeless splendor where ancient gladiators battled in the Colosseum and emperors ruled from Palatine Hill. Toss coins in Trevi Fountain, savor authentic carbonara in Trastevere alleys, and discover where history was made in this romantic Italian capital."
    },

    {
        "_id":8,
        "img":"images/egypt.jpg",
        "country":"Egypt",
        "city":"Giza",
        "cost":1850,
        "description":"Journey to ancient Egypt where pyramids pierce the desert sky and the Nile flows through millennia of history. Explore Giza's enigmatic Sphinx, navigate Cairo's bustling bazaars, and witness the treasures of Tutankhamun in this cradle of civilization."
    }
]

app.get("/api/dest/", (req, res)=>{
    console.log("in get request")
    res.send(dest);
});

app.get("/api/dest/:id", (req, res)=>{
    const house = dest.find((house)=>house._id === parseInt(req.params.id));
    res.send(house);
});


app.listen(3001, () => {
    console.log("Server is up and running");
});