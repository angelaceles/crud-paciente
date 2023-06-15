const express = require('express');
const path = require('path');
const upload = require('./middleware/multer')

const { postPaciente, putPaciente, 
        delPaciente, getSignlePaciente, 
        getAllPacientes 
} = require('./controllers/paciente');

const { default: mongoose } = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use(express.static('public'));
app.use('/api/v1', require('./routes/paciente'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', async (req, res) => {
    try {
        const pacientes = await getAllPacientes();
        res.render('index', { pacientes });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los pacientes');
    }
});

app.get('/agregar', (req, res) => {
    res.render('contacto-agregar');
});


app.get('/contactos/:id', async (req, res) => {
    try {
        const paciente = await getSignlePaciente(req.params.id);
        if (!paciente) {
            return res.status(404).send('Paciente no encontrado');
        }

        res.render('contacto-detalle', { paciente });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los detalles del paciente');
    }
});

app.get('/editar/:id', async (req, res) => {
    const pacienteId = req.params.id;
    try {
      const paciente = await getSignlePaciente(req.params.id);
      if (!paciente) {
        return res.render('error', { message: 'Contacto no encontrado' });
      }
  
      res.render('contacto-editar', { paciente });
    } catch (error) {
      console.log(error);
      res.render('error', { message: 'Error al obtener el paciente' });
    }
  });  

app.post('/putPaciente/:id', upload.single('image'), putPaciente);

app.get('/contacto/eliminar/:id', async (req, res) => {
    const pacienteId = req.params.id;
    try {
      await delPaciente(pacienteId, res);
    } catch (error) {
      console.log(error);
      res.render('error', { message: 'Error al eliminar el contacto' });
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));