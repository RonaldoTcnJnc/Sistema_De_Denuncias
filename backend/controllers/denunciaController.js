import { Denuncia } from '../models/Denuncia.js';

export const getDenuncias = async (req, res) => {
    try {
        const denuncias = await Denuncia.findAll(100);
        // Convert Buffer to Base64 for frontend display
        const processedDenuncias = denuncias.map(d => {
            if (d.fotografia) {
                d.fotografia = d.fotografia.toString('base64');
            }
            return d;
        });
        res.json(processedDenuncias);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener denuncias' });
    }
};

export const getDenunciasByCiudadano = async (req, res) => {
    try {
        const { id } = req.params;
        const denuncias = await Denuncia.findByCitizenId(id);
        // Convert Buffer to Base64
        const processedDenuncias = denuncias.map(d => {
            if (d.fotografia) {
                d.fotografia = d.fotografia.toString('base64');
            }
            if (d.resolucion_evidencia) {
                d.resolucion_evidencia = d.resolucion_evidencia.toString('base64');
            }
            return d;
        });
        res.json(processedDenuncias);
    } catch (err) {
        console.error('Error fetching user reports:', err);
        res.status(500).json({ error: 'Error al obtener denuncias del ciudadano' });
    }
};

export const createDenuncia = async (req, res) => {
    try {
        if (req.body.fotografia) {
            req.body.fotografia = Buffer.from(req.body.fotografia, 'base64');
        }
        const denuncia = await Denuncia.create(req.body);
        res.status(201).json(denuncia);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear denuncia' });
    }
};

export const updateDenunciaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, prioridad, evidencia, autoridad_id, comentario } = req.body; // evidencia in base64

        const updated = await Denuncia.updateStatus(id, { estado, prioridad });

        if (!updated) {
            return res.status(404).json({ error: 'Denuncia no encontrada' });
        }

        // Handle Evidence for Finalized Reports
        if (estado === 'Resuelta' && (evidencia || comentario)) {
            const evidenciaBuffer = evidencia ? Buffer.from(evidencia, 'base64') : null;
            await Denuncia.addAuthorityUpdate({
                denuncia_id: id,
                autoridad_id: autoridad_id || null, 
                tipo_actualizacion: 'completacion',
                descripcion: comentario || 'Denuncia resuelta.',
                fotografia_evidencia: evidenciaBuffer,
                mime_type: req.body.mime_type, // Pass mime type from request
                visible_para_ciudadano: true
            });
        }

        res.json(updated);
    } catch (err) {
        console.error('Error updating denuncia:', err);
        res.status(500).json({ error: 'Error al actualizar denuncia' });
    }
};

export const assignDenuncia = async (req, res) => {
    try {
        const assignment = await Denuncia.assign(req.body);
        res.status(201).json(assignment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al asignar denuncia' });
    }
};

export const trackDenuncia = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate that ID is an integer to prevent SQL injection or errors if uuid was expected but we use serial
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID de denuncia inválido' });
        }

        const denuncia = await Denuncia.findById(id);

        if (!denuncia) {
            return res.status(404).json({ error: 'Denuncia no encontrada' });
        }

        // Return only necessary fields for public tracking
        res.json({
            id: denuncia.id,
            titulo: denuncia.titulo,
            estado: denuncia.estado,
            fecha_reporte: denuncia.fecha_reporte,
            categoria: denuncia.categoria,
            ubicacion: denuncia.ubicacion,
            resolucion_comentario: denuncia.resolucion_comentario,
            resolucion_evidencia: denuncia.resolucion_evidencia ? denuncia.resolucion_evidencia.toString('base64') : null,
            resolucion_mime_type: denuncia.resolucion_mime_type
        });
    } catch (err) {
        console.error('Error tracking denuncia:', err);
        res.status(500).json({ error: 'Error al consultar estado de denuncia' });
    }
};

export const createAnonymousDenuncia = async (req, res) => {
    try {
        // Create anonymous report without ciudadano_id
        const denunciaData = {
            ...req.body,
            ciudadano_id: null // Explicitly set to null for anonymous reports
        };

        // Remove es_anonima if it was sent from frontend
        delete denunciaData.es_anonima;

        if (denunciaData.fotografia) {
            denunciaData.fotografia = Buffer.from(denunciaData.fotografia, 'base64');
        }

        const denuncia = await Denuncia.create(denunciaData);

        // Return the denuncia with tracking_id (which is the same as id)
        res.status(201).json({
            ...denuncia,
            tracking_id: denuncia.id,
            message: 'Denuncia anónima creada exitosamente'
        });
    } catch (err) {
        console.error('Error creating anonymous denuncia:', err);
        res.status(500).json({ error: 'Error al crear denuncia anónima' });
    }
};

export const checkDenuncias = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
        }

        const queryTerm = q.trim().toUpperCase();

        // 1. Check for Vehicle Plate (Exact or close match)
        const plateCount = await Denuncia.checkPlate(queryTerm);

        if (plateCount > 0) {
            return res.json({
                found: true,
                count: plateCount,
                type: 'vehicle',
                query: queryTerm.toUpperCase()
            });
        }

        // If not found by plate, return false (Text search removed per user request)
        res.json({
            found: false,
            count: 0,
            type: 'none',
            query: queryTerm
        });

    } catch (err) {
        console.error('Error checking denuncias:', err);
        res.status(500).json({ error: 'Error al verificar antecedentes' });
    }
};

export const getEstadisticas = async (req, res) => {
    try {
        const stats = await Denuncia.getEstadisticas();
        res.json(stats);
    } catch (err) {
        console.error('Error getting statistics:', err);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

