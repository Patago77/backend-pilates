const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 📦 Configuración de conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'casa_finanzas'
});

db.connect((err) => {
  if (err) throw err;
  console.log('📦 Conectado a la base de datos MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🟢');
});

// ✅ Ruta para registrar ingresos o egresos
app.post('/api/movimientos', (req, res) => {
  const { fecha, tipo, categoria, descripcion, monto, metodo_pago } = req.body;

  const query = `
    INSERT INTO movimientos (fecha, tipo, categoria, descripcion, monto, metodo_pago)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [fecha, tipo, categoria, descripcion, monto, metodo_pago], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar el movimiento:', err);
      return res.status(500).json({ error: 'Error al guardar el movimiento' });
    }

    res.json({ mensaje: '✅ Movimiento guardado correctamente' });
  });
});
// ✅ Ruta para obtener todos los movimientos
app.get('/api/movimientos', (req, res) => {
  const query = 'SELECT * FROM movimientos ORDER BY fecha DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener movimientos:', err);
      return res.status(500).json({ error: 'Error al obtener los movimientos' });
    }

    res.json(results);
  });
});

// 🗑️ Ruta para eliminar un movimiento por ID
app.delete('/api/movimientos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM movimientos WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar movimiento:', err);
      return res.status(500).json({ error: 'Error al eliminar' });
    }
    res.json({ mensaje: '🗑️ Movimiento eliminado correctamente' });
  });
});

app.put('/api/movimientos/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, tipo, categoria, descripcion, monto, metodo_pago } = req.body;

  const query = `
    UPDATE movimientos
    SET fecha = ?, tipo = ?, categoria = ?, descripcion = ?, monto = ?, metodo_pago = ?
    WHERE id = ?
  `;

  db.query(query, [fecha, tipo, categoria, descripcion, monto, metodo_pago, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar movimiento:', err);
      return res.status(500).json({ error: 'Error al actualizar' });
    }

    res.json({ mensaje: '✏️ Movimiento actualizado correctamente' });
  });
});






app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
