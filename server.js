const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
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

mongoose
    .connect("mongodb+srv://neelpp:TravelSite@traveldata.xfnsnpl.mongodb.net/?appName=TravelData")
    .then(async () => {
        console.log("Connected to MongoDB");

        const count = await Blog.countDocuments();
        if (count === 0) {
            await Blog.insertMany(sampleBlogs);
        }
    })
    .catch((error) => {
        console.log("Couldn't connect to MongoDB", error);
    });

const sampleBlogs = [
    {
        img: "images/egypt.jpg",
        title: "The Great Pyramid of Giza - Egypt",
        content:
            "From midnight camel treks through moonlit desert to sunrise yoga atop the Queen's Pyramid, our 24-hour Giza adventure revealed secrets most visitors never see. We explored the lesser-known Bent Pyramid, haggled for hieroglyph scarabs in Bedouin tents, and watched archaeologists uncover 4,000-year-old tools - a living museum where past and present collide.",
        author: "Cleopatra Philopator"
    },
    {
        img: "images/cambodia.jpg",
        title: "Angkor Wat - Cambodia",
        content:
            "As 1,000-year-old temple spires emerge from mist and monks chant ancient Pali verses, you understand why Khmers called this 'City of Gods.' We climbed hidden staircases to explore secret libraries where Sanskrit texts still whisper forgotten wisdom, revealing the Khmer Empire's cosmic architecture that rivals Egypt's precision.",
        author: "Dr. Liam Chen"
    }
];

const destinations = [
    {
        "_id": 1,
        "img": "images/greece.jpg",
        "country": "Greece",
        "city": "Santorini",
        "cost": 2051,
        "description": "Discover the sun-kissed islands of Greece, where azure waters meet white-washed cliffs. From Santorini's iconic sunsets to Athens' ancient wonders, experience Mediterranean magic."
    },
    {
        "_id": 2,
        "img": "images/dubai.jpg",
        "country": "United Arab Emirates",
        "city": "Dubai",
        "cost": 2023,
        "description": "Discover the UAE's dazzling fusion of tradition and innovation - from Dubai's soaring Burj Khalifa to Abu Dhabi's serene Sheikh Zayed Mosque. Experience desert adventures, luxury shopping, and Arabian hospitality in this Middle Eastern gem."
    },
    {
        "_id": 3,
        "img": "images/switzerland.jpg",
        "country": "Switzerland",
        "city": "Interlaken",
        "cost": 3650,
        "description": "Experience Switzerland's breathtaking Alpine majesty - crystal-clear lakes, snow-capped peaks, and charming villages. From Interlaken's adventure sports to Lucerne's medieval charm, discover chocolate-box perfection."
    },
    {
        "_id": 4,
        "img": "images/paris.jpg",
        "country": "France",
        "city": "Paris",
        "cost": 2450,
        "description": "Experience the City of Light's timeless romance with Eiffel Tower sunsets, Seine River cruises, and charming Montmartre streets. Savor buttery croissants at hidden patisseries, explore the Louvre's masterpieces, and fall in love with Parisian elegance and joie de vivre."
    },
    {
        "_id": 5,
        "img": "images/beijing.jpg",
        "country": "China",
        "city": "Beijing",
        "cost": 2100,
        "description": "Discover Beijing's majestic blend of ancient imperial grandeur and modern dynamism. Walk the Great Wall's winding battlements, explore the Forbidden City's crimson palaces, savor Peking duck in hidden hutongs, and experience China's rich cultural heartbeat in this historic capital."
    },
    {
        "_id": 6,
        "img": "images/tokyo.jpg",
        "country": "Japan",
        "city": "Tokyo",
        "cost": 2800,
        "description": "Experience Tokyo's electrifying fusion of ancient tradition and futuristic innovation. From serene Sensoji Temple to neon-lit Shibuya Crossing, savor worldclass sushi, explore hidden alleyway izakayas, and discover cherry blossom magic in this vibrant metropolis."
    },
    {
        "_id": 7,
        "img": "images/rome.jpg",
        "country": "Italy",
        "city": "Rome",
        "cost": 2500,
        "description": "Experience Eternal Rome's timeless splendor where ancient gladiators battled in the Colosseum and emperors ruled from Palatine Hill. Toss coins in Trevi Fountain, savor authentic carbonara in Trastevere alleys, and discover where history was made in this romantic Italian capital."
    },
    {
        "_id": 8,
        "img": "images/egypt.jpg",
        "country": "Egypt",
        "city": "Giza",
        "cost": 1850,
        "description": "Journey to ancient Egypt where pyramids pierce the desert sky and the Nile flows through millennia of history. Explore Giza's enigmatic Sphinx, navigate Cairo's bustling bazaars, and witness the treasures of Tutankhamun in this cradle of civilization."
    }
];

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    img: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/api/dest/", (req, res) => {
    res.send(destinations);
});

app.get("/api/dest/:id", (req, res) => {
    const destination = destinations.find((d) => d._id == req.params.id);
    res.send(destination);
});

app.get("/api/blogs/", async (req, res) => {
    const blogs = await Blog.find();
    res.send(blogs);
});

app.get("/api/blogs/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404).send("Blog not found");
        return;
    }
    res.send(blog);
});

app.post("/api/blogs", upload.single("img"), async (req, res) => {
    const result = validateBlog(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    if (req.file) {
        blog.img = "images/" + req.file.filename;
    }

    const newBlog = await blog.save();
    res.status(200).send(newBlog);
});

app.put("/api/blogs/:id", upload.single("img"), async (req, res) => {
    const dataToValidate = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    const result = validateBlogEdit(dataToValidate);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const fieldsToUpdate = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    if (req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });

    if (!updated) {
        res.status(404).send("Blog not found");
        return;
    }

    res.status(200).send(updated);
});

app.delete("/api/blogs/:id", async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        res.status(404).send("Blog not found");
        return;
    }

    res.status(200).send(blog);
});

const validateBlog = (blog) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        content: Joi.string().min(10).required(),
        author: Joi.string().min(2).required(),
    });

    return schema.validate(blog);
};

const validateBlogEdit = (blog) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        content: Joi.string().min(10).required(),
        author: Joi.string().min(2).required(),
    });

    return schema.validate(blog);
};

app.listen(3001, () => {
    console.log("Server is up and running on port 3001");
});
