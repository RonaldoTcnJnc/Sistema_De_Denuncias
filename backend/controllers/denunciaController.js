import { Denuncia } from '../models/Denuncia.js';

export const getDenuncias = async (req, res) => {
    try {
        const denuncias = await Denuncia.findAll(100);
        res.json(denuncias);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener denuncias' });
    }
};

export const getDenunciasByCiudadano = async (req, res) => {
    try {
        const { id } = req.params;
        const denuncias = await Denuncia.findByCitizenId(id);
        res.json(denuncias);
    } catch (err) {
        console.error('Error fetching user reports:', err);
        res.status(500).json({ error: 'Error al obtener denuncias del ciudadano' });
    }
};

export const createDenuncia = async (req, res) => {
    try {
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
        const { estado, prioridad } = req.body;
        const updated = await Denuncia.updateStatus(id, { estado, prioridad });

        if (!updated) {
            return res.status(404).json({ error: 'Denuncia no encontrada' });
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
