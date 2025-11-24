const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");

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
];

let blogs = [
    {
        id: 1,
        img: "images/egypt.jpg",
        title: "The Great Pyramid of Giza - Egypt",
        content: "From midnight camel treks through moonlit desert to sunrise yoga atop the Queen's Pyramid, our 24-hour Giza adventure revealed secrets most visitors never see. We explored the lesser-known Bent Pyramid, haggled for hieroglyph scarabs in Bedouin tents, and watched archaeologists uncover 4,000-year-old tools - a living museum where past and present collide.",
        author: "Cleopatra Philopator"
    },
    {
        id: 2,
        img: "images/cambodia.jpg",
        title: "Angkor Wat - Cambodia",
        content: "As 1,000-year-old temple spires emerge from mist and monks chant ancient Pali verses, you understand why Khmers called this 'City of Gods.' We climbed hidden staircases to explore secret libraries where Sanskrit texts still whisper forgotten wisdom, revealing the Khmer Empire's cosmic architecture that rivals Egypt's precision.",
        author: "Dr. Liam Chen"
    }

]; 

// Destination endpoints
app.get("/api/dest/", (req, res) => {
    console.log("in get request for destinations");
    res.send(dest);
});

app.get("/api/dest/:id", (req, res) => {
    const destination = dest.find((d) => d._id === parseInt(req.params.id));
    res.send(destination);
});

// Blog endpoints
app.get("/api/blogs/", (req, res) => {
    console.log("Getting all blogs");
    res.send(blogs);
});

app.get("/api/blogs/:id", (req, res) => {
    const blog = blogs.find((b) => b._id === parseInt(req.params.id));
    res.send(blog);
});

app.post("/api/blogs", upload.single("img"), (req, res) => {
    console.log("in post request for blog");
    const result = validateBlog(req.body);

    if (result.error) {
        console.log("Validation error:", result.error);
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const blog = {
        _id: blogs.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
    };

    // Adding image
    if (req.file) {
        blog.img = "images/" + req.file.filename;
    }

    blogs.push(blog);
    res.status(200).send(blog);
});

// Edit blog
app.put("/api/blogs/:id", upload.single("img"), (req, res) => {
    console.log("in put request for blog");
    const id = parseInt(req.params.id);
    const result = validateBlog(req.body);

    if (result.error) {
        console.log("Validation error:", result.error);
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let blog = blogs.find((b) => b._id === id);

    if (!blog) {
        res.status(404).send("Blog not found");
        return;
    }

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = req.body.author;

    // Update image if new uploaded
    if (req.file) {
        blog.img = "images/" + req.file.filename;
    }

    res.status(200).send(blog);
});

// Delete blog
app.delete("/api/blogs/:id", (req, res) => {
    console.log("in delete request for blog");
    const id = parseInt(req.params.id);
    const index = blogs.findIndex((b) => b._id === id);

    if (index === -1) {
        res.status(404).send("Blog not found");
        return;
    }

    blogs.splice(index, 1);
    res.status(200).send({ message: "Blog deleted successfully" });
});

const validateBlog = (blog) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        title: Joi.string().min(3).required(),
        content: Joi.string().min(10).required(),
        author: Joi.string().min(2).required(),
    });

    return schema.validate(blog);
};

app.listen(3001, () => {
    console.log("Server is up and running");
});