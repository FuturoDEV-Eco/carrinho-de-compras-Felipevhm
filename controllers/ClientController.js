const Database = require("./../database/db");

class ClientController extends Database {
    constructor() {
        super();
        this.createClient = this.createClient.bind(this);
        this.listClients = this.listClients.bind(this);
        this.getClientById = this.getClientById.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
    }

    async createClient(req, res) {
        const { name, email, cpf, contact } = req.body;
        try {
            const result = await this.database.query(
                'INSERT INTO clients (name, email, cpf, contact) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, cpf, contact]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listClients(req, res) {
        try {
            const result = await this.database.query('SELECT * FROM clients');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getClientById(req, res) {
        const { id } = req.params;
        try {
            const result = await this.database.query('SELECT * FROM clients WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateClient(req, res) {
        const { id } = req.params;
        const { name, email, cpf, contact } = req.body;
        try {
            const result = await this.database.query(
                'UPDATE clients SET name = $1, email = $2, cpf = $3, contact = $4 WHERE id = $5 RETURNING *',
                [name, email, cpf, contact, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteClient(req, res) {
        const { id } = req.params;
        try {
            const result = await this.database.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            res.status(200).json({ message: 'Cliente deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ClientController();
