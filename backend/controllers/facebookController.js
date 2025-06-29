const { ApifyClient } = require('apify-client');

// Initialize the ApifyClient with your token
const client = new ApifyClient({
    token: 'apify_api_u4HBr8LyQL9FIGd0sejBavopuqvhxZ3Ryt0t', // Tu token de Apify
});

const getFacebookComments = async (req, res) => {
    try {
        const { url } = req.body; // Espera la URL en el cuerpo de la solicitud

        if (!url) {
            return res.status(400).json({ error: 'La URL de la publicación es requerida' });
        }

        // Preparar la entrada para el actor
        const input = {
            startUrls: [{ url }],
            resultsLimit: 50, // Extraer hasta 50 comentarios
            includeNestedComments: false, // Excluir comentarios anidados
            viewOption: 'RANKED_UNFILTERED' // Mostrar comentarios ordenados sin filtrar
        };

        // Ejecutar el actor de forma síncrona y obtener los items del dataset
        const run = await client.actor("apify~facebook-comments-scraper").call(input);

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
        res.status(500).json({ error: 'Error al extraer comentarios de Facebook' });
    }
};

module.exports = { getFacebookComments };