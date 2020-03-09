require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Contact = require("./models/contact");
const morgan = require("morgan");
const cors = require("cors");

app.use(express.static("build"));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

//
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
//

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Mary Poppendieck",
    number: "12-43-123546",
    id: 3
  },
  {
    name: "Dan Abramov",
    number: "39-23-6543210",
    id: 4
  }
];

// Homepage
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// Display all the contacts in the phonebook
app.get("/api/persons", (req, res) => {
  Contact.find({}).then(result => {
    res.json(result);
    mongoose.connection.close();
  });
});

// ROUTE to display info about the phonebook
app.get("/info", (req, res) => {
  Contact.find({}).then(result => {
    res.send(`<p>Phonebook has ${result.length} people</p>
      <p>${Date()}</p>`);
  });
});

// Route to open a specific Contact
app.get("/api/persons/:id", (req, res) => {
  // Finding contact by id in mongoDB
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

// DELETE contact by ID
app.delete("/api/persons/:id", (req, res) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

// CREATE a new Contact
app.post("/api/persons", (req, res) => {
  if (req.body.name && req.body.number) {
    const contact = new Contact({
      name: req.body.name,
      number: req.body.number
    });

    contact.save().then(response => {
      console.log(
        `Added ${response.name} number ${response.number} to phonebook`
      );
      res.json(response.toJSON());
      mongoose.connection.close();
    });
  } else {
    const error = { error: "name and number cannot be empty" };
    res.status(400).json(error);
  }
});

//Update a contact
app.put("/api/persons/:id", (req, res, next) => {
  const contact = {
    number: req.body.number
  };

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact.toJSON());
    })
    .catch(error => next(error));
});

// Unknown Endpoint Handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};
app.use(unknownEndpoint);

// Error Handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id " });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
