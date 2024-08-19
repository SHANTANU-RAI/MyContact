const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route GET / api/ contacts
//@access private

const getContacts = asyncHandler(async (req,res) => {
    const contacts = await Contact.find({ user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc create contacts
//@route POST / api/ contacts
//@access private

const createContacts = asyncHandler( async(req,res) => {
    
    console.log("the request body is:" , req.body);
    const {name , email , phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("all fields are madatory !")
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    res.status(201).json(contact);
});

//@desc Get  contacts
//@route GET / api/ contacts/:id
//@access private

const getContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc update contacts
//@route PUT / api/ contacts/:id
//@access private

const updateContacts = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id)
    {
        res.status(403);
        throw new Error("User does not have permission to update other users contacts")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    );
    res.status(200).json(updatedContact);
});

//@desc delete contacts
//@route DELETE / api/ contacts/:id
//@access private

const deleteContacts = asyncHandler( async(req,res) => {
    // Combines finding and deleting into one atomic operation.
// Reduces potential issues related to document state or method usage.
    const contact = await Contact.findById(req.params.id);

    if(contact.user_id.toString() !== req.user.id)
        {
            res.status(403);
            throw new Error("User does not have permission to update other users contacts")
        }

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    await Contact.deleteOne({_id: req.params.id});

    res.status(200).json({ message: "Contact deleted", contact });

    //Requires two operations: finding the document and then deleting it.
    //If there are any issues with the document instance, remove may not work as expected.
    // const contact = await Contact.findById(req.params.id);
    // if(!contact){
    //     res.status(404);
    //     throw new Error("Contact not found");
    // }

    //  WRONG COMMAND IT DELETES THE ENTIRE DATABASE CONTACTS
    
    // await contact.remove();
    // res.status(200).json(contact);
});




module.exports = {getContacts , createContacts , getContact , updateContacts , deleteContacts };