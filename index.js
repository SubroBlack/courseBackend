const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

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
  const person = {
    name: req.body.name,
    number: req.body.number,
    id: Math.floor(Math.random() * 10000)
  };
  console.log(person);
  persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
