const express = require("express");
const router = express.Router();
const Controller = require('../controllers/petContoller');
const { moveUserByIdToReq, validatePetBody } = require('../middleware/petsMiddleware');
const { isExistingUser, auth, adminAuth } = require('../middleware/usersMiddleware');
const { upload, uploadToCloudinary } = require("../middleware/imagesMiddleware");

//get entire list of pets
router.get('/', Controller.getPetsList);

//get specific list of pets
router.get('/search', Controller.search);

//get specific pet
router.get('/:petId', Controller.getPet);

//get all pets that user has
router.get('/user/:id', moveUserByIdToReq, isExistingUser, Controller.getPetsForUser);

//add a pet to the db
router.post('/', adminAuth, upload.single('petImage'), uploadToCloudinary, validatePetBody, Controller.addPet);

//delete a pet from the db
router.delete('/:id/delete-pet', auth, Controller.deletePet);

//update a pet
router.put('/:petId', adminAuth, upload.single('petImage'), uploadToCloudinary, validatePetBody, Controller.updatePet);

//adopt of foster a pet
router.post('/:id/adopt', auth, Controller.adoptOrFosterPet);

//return a pet
router.post('/:id/return', auth, Controller.returnPet);

//save a pet to keep an eye on
router.post('/:petId/save', auth, Controller.savePetForUser);

//remove a pet from the watch list
router.delete('/:petId/save', auth, Controller.deletePetFromUser);

module.exports = router;