const express = require("express");
const { getAllPacientes, postPaciente, 
        putPaciente, delPaciente, getSignlePaciente } = require("../controllers/paciente");
const upload = require('../middleware/multer')
const router = express.Router()

router.get('/', getAllPacientes);
router.post('/add',upload.single('image'), postPaciente);
router.put('/:id', upload.single("image"), putPaciente);
router.delete('/:id', delPaciente);
router.get('/:id', getSignlePaciente);

module.exports = router