const { admin, db } = require('../config/firebase');

const createReport = async (title, topicId, userId) => {
  try {
    console.log('Creando reporte:', { title, topicId, userId });

    // Verificar que el tema exista y pertenezca al usuario
    const topicRef = db.collection('topics').doc(topicId);
    const topicDoc = await topicRef.get();
    if (!topicDoc.exists) {
      throw new Error('El tema no existe');
    }
    if (topicDoc.data().userId !== userId) {
      throw new Error('No autorizado para crear reportes en este tema');
    }

    // Verificar si ya existe un reporte con el mismo título en este tema
    const existingReport = await db.collection('reports')
      .where('topicId', '==', topicId)
      .where('title', '==', title)
      .get();
    if (!existingReport.empty) {
      throw new Error('Ya existe un reporte con este título en este tema');
    }

    const reportRef = db.collection('reports').doc();
    const report = {
      title,
      topicId,
      userId,
      url: '', // Campo para URL (vacío por ahora, para futura integración)
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await reportRef.set(report);
    console.log('Reporte creado con ID:', reportRef.id);
    return { id: reportRef.id, ...report };
  } catch (error) {
    console.error('Error en createReport:', error);
    throw new Error('Error al crear el reporte: ' + error.message);
  }
};

const getReports = async (topicId, userId) => {
  try {
    console.log('Buscando reportes para topicId:', topicId, 'y userId:', userId);

    // Verificar que el tema exista y pertenezca al usuario
    const topicRef = db.collection('topics').doc(topicId);
    const topicDoc = await topicRef.get();
    if (!topicDoc.exists) {
      throw new Error('El tema no existe');
    }
    if (topicDoc.data().userId !== userId) {
      throw new Error('No autorizado para ver reportes de este tema');
    }

    const snapshot = await db.collection('reports')
      .where('topicId', '==', topicId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    console.log('Reportes encontrados:', snapshot.docs.length);
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Reportes:', reports);
    return reports;
  } catch (error) {
    console.error('Error en getReports:', error);
    throw new Error('Error al obtener los reportes: ' + error.message);
  }
};

const updateReport = async (reportId, topicId, title, userId) => {
  try {
    console.log('Actualizando reporte:', { reportId, topicId, title, userId });

    // Verificar que el reporte exista
    const reportRef = db.collection('reports').doc(reportId);
    const reportDoc = await reportRef.get();
    if (!reportDoc.exists) {
      throw new Error('El reporte no existe');
    }
    if (reportDoc.data().userId !== userId || reportDoc.data().topicId !== topicId) {
      throw new Error('No autorizado para actualizar este reporte');
    }

    // Verificar que el tema exista y pertenezca al usuario
    const topicRef = db.collection('topics').doc(topicId);
    const topicDoc = await topicRef.get();
    if (!topicDoc.exists) {
      throw new Error('El tema no existe');
    }
    if (topicDoc.data().userId !== userId) {
      throw new Error('No autorizado para actualizar reportes en este tema');
    }

    // Verificar si ya existe otro reporte con el mismo título en este tema
    const existingReport = await db.collection('reports')
      .where('topicId', '==', topicId)
      .where('title', '==', title)
      .get();
    if (!existingReport.empty && existingReport.docs[0].id !== reportId) {
      throw new Error('Ya existe un reporte con este título en este tema');
    }

    const updatedReport = {
      title,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await reportRef.update(updatedReport);
    console.log('Reporte actualizado:', reportId);
    return { id: reportId, ...updatedReport, topicId, userId, createdAt: reportDoc.data().createdAt, url: reportDoc.data().url };
  } catch (error) {
    console.error('Error en updateReport:', error);
    throw new Error('Error al actualizar el reporte: ' + error.message);
  }
};

const deleteReport = async (reportId, topicId, userId) => {
  try {
    console.log('Eliminando reporte:', { reportId, topicId, userId });

    // Verificar que el reporte exista
    const reportRef = db.collection('reports').doc(reportId);
    const reportDoc = await reportRef.get();
    if (!reportDoc.exists) {
      throw new Error('El reporte no existe');
    }
    if (reportDoc.data().userId !== userId || reportDoc.data().topicId !== topicId) {
      throw new Error('No autorizado para eliminar este reporte');
    }

    // Verificar que el tema exista y pertenezca al usuario
    const topicRef = db.collection('topics').doc(topicId);
    const topicDoc = await topicRef.get();
    if (!topicDoc.exists) {
      throw new Error('El tema no existe');
    }
    if (topicDoc.data().userId !== userId) {
      throw new Error('No autorizado para eliminar reportes en este tema');
    }

    await reportRef.delete();
    console.log('Reporte eliminado:', reportId);
  } catch (error) {
    console.error('Error en deleteReport:', error);
    throw new Error('Error al eliminar el reporte: ' + error.message);
  }
};

module.exports = { createReport, getReports, updateReport, deleteReport };