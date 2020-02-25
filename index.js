const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

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

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has ${persons.length} people</p>
    <p>${Date()}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const result = persons.filter(person => person.id === Number(req.params.id));
  if (result.length === 0) {
    res.status(404).end();
  } else if (result.length > 0) {
    res.json(result);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const result = persons.filter(person => person.id !== Number(req.params.id));
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  if (req.body.name && req.body.number) {
    if (persons.filter(person => person.name === req.body.name).length === 0) {
      const contact = {
        name: req.body.name,
        number: req.body.number,
        id: Math.floor(Math.random() * 10000)
      };
      persons = persons.concat(contact);
      res.status(200).json(contact);
    } else {
      const error = { error: "name must be unique" };
      res.status(400).json(error);
    }
  } else {
    const error = { error: "name and number cannot be empty" };
    res.status(400).json(error);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
