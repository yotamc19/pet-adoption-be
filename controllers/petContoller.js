const { getFullPetsList, searchPetsList, getPetById, addPetToCollection, deletePetById, updatePetById, getPetsByUserEmail, userAdoptOrFosterPet, userReturnPet } = require('../models/petsModel');
const { getUserById, updateUserById } = require('../models/usersModel');

const getPetsList = async (req, res) => {
    try {
        const list = await getFullPetsList();
        res.send(list);
    }
    catch (err) {
        res.status(400).send('Something went wrong');
    }
}

const search = async (req, res) => {
    try {
        const { type, name, adopStatus, minHeight, minWeight } = req.query;
        const list = await searchPetsList(type, name, adopStatus, minHeight, minWeight);
        res.send(list);
    } catch (err) {
        res.status(400).send('Something went wrong');
    }
}

const getPet = async (req, res) => {
    try {
        const pet = await getPetById(req.params.petId);
        res.send(pet);
    } catch (err) {
        res.status(400).send('No pet with this id');
    }
}

const getPetsForUser = async (req, res) => {
    try {
        const pets = await getPetsByUserEmail(req.body.email);
        res.send(pets);
    } catch (err) {
        res.status(400).send('Something went wrong');
    }
}

const addPet = async (req, res) => {
    try {
        const { name,
            type,
            height,
            weight,
            color,
            hypo,
            dietery,
            breed,
            bio,
            imageUrl
        } = req.body;
        const petObj = {
            img: imageUrl,
            name,
            type,
            adopStatus: '',
            ownerEmail: '',
            height,
            weight,
            color,
            hypo,
            dietery,
            breed,
            bio
        };
        const data = await addPetToCollection(petObj);
        res.send(data);
    } catch (err) {
        res.status(400).send('Something went wrong');
    }
}

const deletePet = async (req, res) => {
    try {
        await deletePetById(req.params.id);
        res.send('Deleted succefully');
    } catch (err) {
        res.status(400).send('No pet with this id');
    }
}

const updatePet = async (req, res) => {
    try {
        const { name,
            type,
            height,
            weight,
            color,
            hypo,
            dietery,
            breed,
            bio,
            imageUrl
        } = req.body;
        const petObj = {
            img: imageUrl,
            name,
            type,
            adopStatus: '',
            ownerEmail: '',
            height,
            weight,
            color,
            hypo,
            dietery,
            breed,
            bio
        };
        const doc = await updatePetById(req.params.petId, petObj);
        res.send('Updated succesfully');
    } catch (err) {
        res.status(400).send('No pet with this id')
    }
}

const adoptOrFosterPet = async (req, res) => {
    try {
        const petId = req.params.id;
        const doc = await userAdoptOrFosterPet(petId, req.body.id, req.body.type);
        res.send(doc);
    } catch (err) {
        res.status(400).send('No pet with this id');
    }
}

const returnPet = async (req, res) => {
    try {
        const petId = req.params.id;
        const doc = await userReturnPet(petId);
        res.send(doc);
    } catch (err) {
        res.status(400).send('No pet with this id')
    }
}

const savePetForUser = async (req, res) => {
    try {
        const user = await getUserById(req.body.id);
        let savedPets = user[0].savedPets;
        const pet = await getPetById(req.params.petId);
        savedPets.push(pet[0]);
        const doc = await updateUserById(req.body.id, { savedPets });
        if (!doc) {
            throw new Error();
        }
        res.send(doc);
    } catch (err) {
        res.status(400).send('No pet with this id');
    }
}

const deletePetFromUser = async (req, res) => {
    try {
        const user = await getUserById(req.body.id);
        const savedPets = user[0].savedPets;
        const petId = req.params.petId;
        const list = savedPets.filter(p => p._id != petId);
        const doc = await updateUserById(req.body.id, { savedPets: list });
        if (!doc) {
            throw new Error();
        }
        res.send(doc);
    } catch (err) {
        res.status(400).send('No pet with this id');
    }
}

module.exports = { getPetsList, search, getPet, getPetsForUser, addPet, deletePet, updatePet, adoptOrFosterPet, returnPet, savePetForUser, deletePetFromUser };