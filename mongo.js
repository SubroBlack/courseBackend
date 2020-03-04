const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as arguement");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Black:${password}@cluster0-juyfd.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String
});

const Contact = mongoose.model("Contact", contactSchema);

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
