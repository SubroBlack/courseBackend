const mongoose = require("mongoose");

const password = process.argv[2];

//const url = `mongodb+srv://Black:${password}@cluster0-juyfd.mongodb.net/phonebook?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

// Connecting to MongoDB database
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.log("Error connecting to MongoDB: ", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Contact", contactSchema);

/*
if (process.argv.length < 4) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
} else {
  const contact = new Contact({
    name: process.argv[3],
    phone: process.argv[4]
  });

  contact.save().then(response => {
    console.log(`Added ${response.name} number ${response.phone} to phonebook`);
    mongoose.connection.close();
  });
}
*/
