const app = require('./app');

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Servidor corriendo en http://192.168.1.4:${PORT}`);
});
