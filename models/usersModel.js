const User = require('../schemas/userSchema');
const { getFullPetsList, updatePetById } = require('./petsModel');

const getFullUsersList = async () => {
    const list = await User.find({});
    return list;
}

const getUserById = async (id) => {
    const res = await User.find({ _id: id });
    return res;
}

const getUserByEmail = async (email) => {
    const res = await User.find({ email });
    return res;
}

const addUser = async (user) => {
    const data = await user.save();
    return data;
}

const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const validatePhoneNumber = (phoneNumber) => {
    return /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phoneNumber);
}

const deleteUserById = async (id) => {
    const user = await getUserById(id);
    const email = user[0].email;
    const petsList = await getFullPetsList();
    for (let i = 0; i < petsList.length; i++) {
        if (petsList[i].ownerEmail === email) {
            await updatePetById(petsList[i]._id, { ownerEmail: '' });
        }
    }
    await User.findByIdAndDelete(id, (err, docs) => {
        if (docs) {
            return docs;
        }
    }).clone();
}

const updateUserByEmail = async (email, updatedUser) => {
    const user = await getUserByEmail(email);
    const doc = await User.findByIdAndUpdate(user[0]._id, updatedUser).clone();
    return doc;
}

const updateUserById = async (id, updatedUser) => {
    const doc = await User.findOneAndUpdate({ _id: id }, updatedUser, { new: true });
    return doc;
}

module.exports = { getFullUsersList, getUserByEmail, validateEmail, validatePhoneNumber, addUser, deleteUserById, updateUserByEmail, getUserById, updateUserById };