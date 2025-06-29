const { ApifyClient } = require('apify-client');

// Initialize the ApifyClient with your token
const client = new ApifyClient({
    token: 'apify_api_6plabqIaYarkJJvtw4Qhbf7uA3YvYU3n4wnc', // Tu token de Apify
});

const getTwitterComments = async (req, res) => {
    try {
        const { url } = req.body; // Espera la URL en el cuerpo de la solicitud

        if (!url) {
            return res.status(400).json({ error: 'La URL de la publicación es requerida' });
        }

        // Validar que la URL sea de Twitter (opcional, ajustable según necesidades)
        const urlPattern = /^https:\/\/(www\.)?x\.com\/.+$/;
        if (!urlPattern.test(url)) {
            return res.status(400).json({ error: 'La URL debe ser un enlace válido de Twitter (https://x.com/...)' });
        }

        // Preparar la entrada para el actor
        const input = {
            postUrls: [{ url }], // Cambiado de tweetUrl a postUrls como requiere este actor
            rankingMode: 'Relevance', // Ordenar por relevancia (si el actor lo soporta)
            maxItems: 10 // Extraer hasta 10 comentarios
        };

        // Ejecutar el actor de forma síncrona y obtener los items del dataset
        const run = await client.actor("scraper_one~x-post-replies-scraper").call(input);

        // Obtener los items del dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        // Filtrar y devolver solo los textos de los comentarios
        const comments = items
            .map(item => item.comments || item) // Asegura que trabajamos con el array de comentarios
            .flat() // Aplana el array en caso de anidamiento
            .filter(comment => comment.text) // Filtra solo los comentarios con texto
            .map(comment => comment.text); // Extrae solo el campo 'text'

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error al extraer comentarios:', error);
        res.status(500).json({ error: 'Error al extraer comentarios de Twitter' });
    }
};

module.exports = { getTwitterComments };