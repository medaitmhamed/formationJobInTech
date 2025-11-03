const { ajouterContact, listerContacts } = require('./contactService');
const formaterContact = require('./utils/format');

ajouterContact("Ossama", "0608080000");
ajouterContact("Med", "0611111111");

listerContacts().forEach(c => console.log(formaterContact(c)));

