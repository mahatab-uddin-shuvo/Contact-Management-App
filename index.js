const program = require('commander');
const validator = require('validator');
const colors = require('colors');
const { prompt } = require('inquirer');

const { addContact,isExistingContact,listContacts,deleteContact,
  readContact ,updateContact } = require('./contact');

const { requiredOption } = require('commander');
var no = (/^(01[6789])(\d{8})$/);
const addQuestions = [
  {
    type : 'input',
    name : 'firstName',
    message : 'Type your FirstName',
    validate(input){
      if(!input){
        console.log('Please Provide FirstName '.inverse.red)
      }
      else{
        return true;
      }
    }
  },
  {
    type : 'input',
    name : 'lastName',
    message : 'Type your LastName',
    validate(input){
      if(!input){
        console.log('Please Provide LastName '.inverse.red)
      }
      else{
        return true;
      }
    }
  },
  {
    type : 'input',
    name : 'email',
    message : 'Type your Email',
    async validate(input){
      if(!input || !validator.isEmail(input)){
        console.log('Please Provide valid Email '.inverse.red)
      }
      else if(await isExistingContact(input)){
        console.log('Contact with this Email Exist '.inverse.red)
      }
      else{
        return true;
      }
    }
  },
  {
    type : 'input',
    name : 'phoneNumber',
    message : 'Type your PhoneNumber',
    validate(input){
      if(!input || (!(no.test(input)))){
        console.log('Please Provide PhoneNumber '.inverse.red)
      }
      else{
        return true;
      }
    }
  },
  {
    type : 'list',
    name : 'type',
    message : 'Please Provide type of Contact ',
    choices : ['Personal','Professional']
  }
  
];

const updateQuestions = [
  {
    type : 'input',
    name : 'firstName',
    message : 'Type your FirstName',
  },
  {
    type : 'input',
    name : 'lastName',
    message : 'Type your LastName',
  },
  {
    type : 'input',
    name : 'email',
    message : 'Type your Email',
    async validate(input){
      if(input && !validator.isEmail(input)){
        console.log('Please Provide valid Email '.inverse.red)
      }
      else{
        return true;
      }
    }
  },
  {
    type : 'input',
    name : 'phoneNumber',
    message : 'Type your PhoneNumber',
  },
  {
    type : 'list',
    name : 'type',
    message : 'Please Provide type of Contact ',
    choices : ['Personal','Professional']
  }
  
];
program.version('0.0.1');

program.description('A Command Line Tool to manage contact')

//add Contact
program
  .command('add')
  .alias('a')
  .description('Please add a Contact')
  // .requiredOption('-f, --firstName <fName>', 'Type Your FirstName ')
  // .requiredOption('-l, --lastName <lName>', 'Type Your LastName ')
  // .requiredOption('-e, --email <email>', 'Type Your email ')
  // .requiredOption('-p, --phoneNumber <pNumber>', 'Type Your Phone Number')
  // .option('-t, --type <type>', 'Type Your Contact type ', 'personal')
  .action(async() => {
    const result =  await prompt (addQuestions)
    console.log(result)
        addContact(result, result.email);
  });

  //listing all contact
program
 .command('list')
 .alias('l')
 .description('Show All Contact')
 .action(async()=>{
   //call function to list all contact
   await listContacts() ;
 });

//Removing contact
program
 .command('delete')
 .alias('d')
 .description('Delete a Contact')
 .requiredOption('-e, --email <email>', 'Type Your email ')
 .action(({email})=>{
   // call function remove contact
   deleteContact(email)
 });

//Read Contact
program
.command('read')
.alias('r')
.description('Read a Contact')
.requiredOption('-e, --email <email>', 'Type Your email ')
.action(({email})=>{
  // call function read contact
  readContact(email);
});

//Update Contact
program
  .command('update')
  .alias('u')
  .description('Update a Contact')
  .requiredOption('-e, --email <email>', 'Type Your email ')
  .action(async({email}) => {
    if(await isExistingContact(email)){
      const result =  await prompt (updateQuestions)
      updateContact(result, email);
    }
    else{
      console.log('contact not found with email to update '.inverse.red)
    }
  });


//console.log(process.argv);
if (!process.argv[2]) {
  program.help();
}
program.parse(process.argv);
