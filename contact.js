const fs = require('fs');

const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

const writeFilePromise = util.promisify(fs.writeFile)

const addContact = async (contact, email) => {
    const contacts = await loadContact()
    const existingContact = await isExistingContact(email);
    if (existingContact) {
        console.log('Contact with this Email Exist'.inverse.red)
    }
    else {
        contacts.push(contact);
        await saveContacts(contacts);
        console.log('Contact Sucessfully Added'.inverse.green);
    }
}

const loadContact = async () => {
    try {
        const dataBuffer = await readFilePromise('./contact.json')
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);

    } catch (err) {
        return [];
    }
}
const saveContacts = async (contacts) => {
    const contactJSON = JSON.stringify(contacts);
    await writeFilePromise('./contact.json', contactJSON)
}

const isExistingContact = async(email)=>{
    const contacts = await loadContact()
    return existingContact = contacts.find(
        eachContact => eachContact.email === email)
}
const listContacts = async ()=>{
    const contacts = await loadContact();
    if(contacts.length > 0){
        console.log('All Contacts '.inverse.green)
        console.log(contacts)
    }
    else{
        console.log('No Contact Available , Please Create One '.inverse.green)
    }
}

const deleteContact = async(email)=>{
    const contacts = await loadContact();
   const contact = await isExistingContact(email);
   if(!contact){
       console.log('Contact Not Found With this Email '.inverse.red);
   }
   else{
       const updatedContacts = contacts.filter(contact => contact.email !== email)
       await saveContacts(updatedContacts);
       console.log('Contact Suceesfully Removed '.inverse.green)
    }
}
const readContact = async(email)=>{
    const contacts = await loadContact();
    const contact = await isExistingContact(email);
    if(!contact){
        console.log('Contact is Not found With this email '.inverse.red);
    }
    else{
        console.log('Contact is Found '.inverse.green);
        console.log(contact)
    }
}

const updateContact = async (updates , email) =>{
    const existingContact = await isExistingContact(email);
    const contacts = await loadContact();
    const { firstName , lastName , email:inputEmail , phoneNumber, type}= updates;
    if (existingContact) {
        const updatedContact = {
            firstname: firstName ? firstName : existingContact.firstName,
            lastname: lastName ? lastName : existingContact.lastName,
            email: inputEmail ? inputEmail : existingContact.email,
            phoneNumber: phoneNumber ? phoneNumber : existingContact.phoneNumber,
            type: type

        }
       const contactsWithUpdates = contacts.map(contact =>
       contact.email === email ? (contact = updatedContact) : contact);
       
       //save updates
       await saveContacts(contactsWithUpdates);
        console.log('Contact Successfully updated')
    }
    else{
        console.log('Contact is Not Found '.inverse.red);
    }
}
module.exports = {
    addContact,
    isExistingContact,
    listContacts,
    deleteContact,
    readContact,
    updateContact
};