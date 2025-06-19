const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// === Assignment Routes ===
const assignmentsController = require('../controllers/assignment.controller');
router.get('/assignments', assignmentsController.getAllAssignments);
router.post('/assignments', upload.single('fileTugas'), assignmentsController.createAssignment);
router.patch('/assignments/:id/toggle-status', assignmentsController.toggleStatusAssignments);

// === Auth Routes ===
const authenticationController = require('../controllers/authentication.controller');
router.post('/login', authenticationController.login);

// === Lab Routes ===
const labController = require('../controllers/lab.controller');
router.get('/lab', labController.labPage);
router.get('/lab/:id', labController.showHomeClassPage);

module.exports = router;