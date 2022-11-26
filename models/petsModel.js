const Pet = require('../schemas/petSchema');
const User = require('../schemas/userSchema');
const { updateUserById, getFullUsersList, getUserById } = require('./usersModel');

const getFullPetsList = async () => {
    const list = await Pet.find({});
    return list;
}

const searchPetsList = async (type, name, adopStatus, minHeight, minWeight) => {
    const reg = new RegExp(name, 'i');
    const searchObj = {
        type, name: { $regex: reg }, adopStatus,
    };

    if (!type) delete searchObj.type;
    if (!name) delete searchObj.name;
    if (!adopStatus) delete searchObj.adopStatus;

    let filteredList = await Pet.find(searchObj);

    if (minHeight && minHeight > 0) {
        filteredList = filteredList.filter(pet => pet.height >= minHeight);
    }
    if (minWeight && minWeight > 0) {
        filteredList = filteredList.filter(pet => pet.weight >= minWeight);
    }

    return filteredList;
}

const getPetById = async (id) => {
    const pet = await Pet.find({ _id: id });
    return pet;
}

const addPetToCollection = async (petDetails) => {
    const pet = new Pet({
        ...petDetails
    });
    if (pet.hypo) {
        pet.hypo = true;
    } else {
        pet.hypo = false;
    }
    const data = await pet.save();
    return data;
}

const deletePetById = async (id) => {
    await Pet.findByIdAndDelete(id, (err, docs) => {
        if (docs) {
            return docs;
        }
    }).clone();
    const usersList = await User.find({});
    for (let i = 0; i < usersList.length; i++) {
        const tempList = usersList[i].savedPets.filter(p => p._id != id);
        await User.findOneAndUpdate({ _id: usersList[i]._id }, { savedPets: tempList }, { new: true });
    }
}

const updatePetById = async (id, petDetails) => {
    const pet = new Pet({
        img: petDetails.img, 
        name: petDetails.name, 
        type: petDetails.type, 
        adopStatus: petDetails.adopStatus, 
        ownerEmail: petDetails.ownerEmail, 
        height: petDetails.height, 
        weight: petDetails.weight, 
        color: petDetails.color, 
        hypo: petDetails.hypo, 
        dietery: petDetails.dietery, 
        breed: petDetails.breed, 
        bio: petDetails.bio, 
        _id: id,
    });
    if (pet.hypo) {
        pet.hypo = true;
    } else {
        pet.hypo = false;
    }
    const doc = await Pet.findOneAndUpdate({ _id: id }, pet, { new: true });
    return doc;
}

const getPetsByUserEmail = async (email) => {
    const list = await Pet.find({ ownerEmail: email });
    return list;
}

const userAdoptOrFosterPet = async (petId, userId, adopStatus) => {
    const res = await User.find({ _id: userId });
    const user = res[0];
    const pet = await getPetById(petId);
    pet[0].adopStatus = adopStatus;
    pet[0].ownerEmail = user.email;
    const doc = await updatePetById(petId, pet[0]);
    const usersList = await User.find({});
    for (let i = 0; i < usersList.length; i++) {
        const tempList = usersList[i].savedPets;
        const newList = tempList.map(p => {
            if (p._id == petId) {
                p.adopStatus = adopStatus;
                p.ownerEmail = user.email;
            }
            return p;
        });
        await User.findOneAndUpdate({ _id: usersList[i]._id }, { savedPets: newList });
    }
    return doc;
}

const userReturnPet = async (petId) => {
    const pet = await getPetById(petId);
    pet[0].adopStatus = '';
    pet[0].ownerEmail = '';
    const doc = await updatePetById(petId, pet[0]);

    const usersList = await User.find({});
    for (let i = 0; i < usersList.length; i++) {
        const tempList = usersList[i].savedPets;
        const newList = tempList.map(p => {
            if (p._id == petId) {
                p.adopStatus = '';
            }
            return p;
        });
        await User.findOneAndUpdate({ _id: usersList[i]._id }, { savedPets: newList }, { new: true });
    }

    return doc;
}

module.exports = { getFullPetsList, searchPetsList, getPetById, addPetToCollection, deletePetById, updatePetById, getPetsByUserEmail, userAdoptOrFosterPet, userReturnPet };