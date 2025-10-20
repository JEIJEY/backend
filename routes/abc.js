const express = require('express');
const router = express.Router();
const abcController = require('../controllers/abcController');

router.get('/reporte', abcController.obtenerReporteABC);
router.post('/recalcular', abcController.recalcularABC);
router.get('/alertas', abcController.obtenerAlertasAutomaticas);

module.exports = router;