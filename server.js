const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/mobility-app')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/mobility-app/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${port}`);
});
