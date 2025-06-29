const { admin, db } = require('../config/firebase');

const createTopic = async (name, userId) => {
  try {
    console.log('Creando tema:', { name, userId });
    const existingTopic = await db.collection('topics')
      .where('userId', '==', userId)
      .where('name', '==', name)
      .get();
    if (!existingTopic.empty) {
      throw new Error('Ya existe un tema con este nombre para este usuario');
    }

    const topicRef = db.collection('topics').doc();
    const topic = {
      name,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await topicRef.set(topic);
    console.log('Tema creado con ID:', topicRef.id);
    return { id: topicRef.id, ...topic };
  } catch (error) {
    console.error('Error en createTopic:', error);
    throw new Error('Error al crear el tema: ' + error.message);
  }
};

const getTopics = async (userId) => {
  try {
    console.log('Buscando temas para userId:', userId);
    const snapshot = await db.collection('topics')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    console.log('Documentos encontrados:', snapshot.docs.length);
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Temas:', topics);
    return topics;
  } catch (error) {
    console.error('Error en getTopics:', error);
    throw new Error('Error al obtener los temas: ' + error.message);
  }
};

const updateTopic = async (topicId, name, userId) => {
  try {
    console.log('Actualizando tema:', { topicId, name, userId });
    const topicRef = db.collection('topics').doc(topicId);
    const doc = await topicRef.get();
    if (!doc.exists) {
      throw new Error('El tema no existe');
    }
    if (doc.data().userId !== userId) {
      throw new Error('No autorizado para actualizar este tema');
    }

    const existingTopic = await db.collection('topics')
      .where('userId', '==', userId)
      .where('name', '==', name)
      .get();
    if (!existingTopic.empty && existingTopic.docs[0].id !== topicId) {
      throw new Error('Ya existe un tema con este nombre para este usuario');
    }

    const updatedTopic = {
      name,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await topicRef.update(updatedTopic);
    console.log('Tema actualizado:', topicId);
    return { id: topicId, ...updatedTopic, userId, createdAt: doc.data().createdAt };
  } catch (error) {
    console.error('Error en updateTopic:', error);
    throw new Error('Error al actualizar el tema: ' + error.message);
  }
};

const deleteTopic = async (topicId, userId) => {
  try {
    console.log('Eliminando tema:', { topicId, userId });
    const topicRef = db.collection('topics').doc(topicId);
    const doc = await topicRef.get();
    if (!doc.exists) {
      throw new Error('El tema no existe');
    }
    if (doc.data().userId !== userId) {
      throw new Error('No autorizado para eliminar este tema');
    }
    await topicRef.delete();
    console.log('Tema eliminado:', topicId);
  } catch (error) {
    console.error('Error en deleteTopic:', error);
    throw new Error('Error al eliminar el tema: ' + error.message);
  }
};

module.exports = { createTopic, getTopics, updateTopic, deleteTopic };