
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'TU_USUARIO',
  host: 'localhost',
  database: 'TU_DB_NAME',
  password: 'TU_PASSWORD',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/incidencias', async (req, res) => {
  const data = req.body;
  
  const query = `
    INSERT INTO incidencias (
      external_id, tipo_incidencia, distrito, direccion, coordenadas, 
      descripcion, diagnostico_ia, solucion_propuesta, codigo_programa, 
      nivel_urgencia, analisis_daño, foto_base64, estado_validacion,
      usuario
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id;
  `;

  const values = [
    data.external_id,
    data.tipo_incidencia,
    data.distrito,
    data.direccion,
    data.coordenadas,
    data.descripcion,
    data.diagnostico_ia,
    data.solucion_propuesta,
    data.codigo_programa,
    data.nivel_urgencia,
    data.analisis_daño,
    data.foto_base64,
    data.estado_validacion,
    data.usuario // NUEVO VALOR PARA LA DB
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('[DB] Error al insertar:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 API activa en puerto ${port}. Registrando usuario del aviso.`);
});
