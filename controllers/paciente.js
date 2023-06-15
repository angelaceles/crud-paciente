const Paciente = require("../model/paciente");
const cloudinary = require("../Utils/cloudinary");
const fs = require('fs')

const getAllPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    return pacientes;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los contactos');
  }
};

const getSignlePaciente = async (pacienteId) => {
  try {
    const paciente = await Paciente.findById(pacienteId);
    return paciente;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el paciente');
  }
};

const postPaciente = async(req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }
    
        const { path } = req.file;
        const result = await cloudinary.uploader.upload(path);
        const { secure_url, public_id } = result;
    
        const paciente = new Paciente({
          idpaciente: req.body.idpaciente,
          lastname: req.body.lastname,
          name: req.body.name,
          sexo: req.body.sexo,
          especialidad: [],
          image: secure_url,
          cloudinary_id: public_id
        });
    
        await paciente.save();
        fs.unlinkSync(path);
        res.redirect('/');

      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el paciente' });
    }
};

const putPaciente = async(req, res) => {
    try {
        let paciente = await Paciente.findById(req.params.id).exec();
    
        if (!paciente) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
        }
    
        if (req.file) {
          await cloudinary.uploader.destroy(paciente.cloudinary_id);
          const result = await cloudinary.uploader.upload(req.file.path);
          paciente.image = result.secure_url;
          paciente.cloudinary_id = result.public_id;
          fs.unlinkSync(req.file.path);
        }
    
        const data = {
            idpaciente: req.body.idpaciente || paciente.idpaciente,
            lastname: req.body.lastname || paciente.lastname,
            name: req.body.name || paciente.name,
            sexo: req.body.sexo || paciente.sexo,
            especialidad: req.body.especialidad || paciente.especialidad,
            image: paciente.image,
            cloudinary_id: paciente.cloudinary_id,
        };
    
        paciente = await Paciente.findByIdAndUpdate(req.params.id, data, { new: true });
        res.redirect('/');
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el paciente' });
    }
};

const delPaciente = async (req, res) => {
  try {
      const paciente = await Paciente.findByIdAndDelete(req);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
      }
  
      await cloudinary.uploader.destroy(paciente.cloudinary_id);
      await Paciente.findByIdAndRemove(req).exec();
      res.redirect('/');
      res.status(200).json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el paciente' });
  }
};

module.exports = {
    getAllPacientes,
    postPaciente,
    putPaciente,
    delPaciente,
    getSignlePaciente
};
