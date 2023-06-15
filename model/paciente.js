const mongoose = require("mongoose");
const {Schema} = mongoose;

const PacienteSchema = new Schema({
    idpaciente: String,
    lastname: String,
    name: String,
    sexo: String,
    especialidad: [],
    image: String,
    cloudinary_id: String
});

const Paciente = mongoose.model('Paciente', PacienteSchema);

module.exports = Paciente;