const dao = require('./dao')

function taskRepository () {
    let dataAccessLayer = dao()

    const now = () => (new Date()).toISOString().slice(0, 19).replace("T", " ");

    const createTable = () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS tasks 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                isComplete INTEGER DEFAULT 0,
                createdAt TEXT,
                updatedAt TEXT
            )`;
        return dataAccessLayer.run(sql)
    }

    const all = () => dataAccessLayer.all(`SELECT id, name, isComplete, createdAt FROM tasks`);
    
    const findById = (id) => dataAccessLayer.get(`SELECT * FROM tasks WHERE id = ?`, [id])
    
    const store = (name, description) => {
        return dataAccessLayer.run(
            `INSERT into tasks (name, description, createdAt, updatedAt) values (?,?,?,?)`,
            [name, description, now(), now()]
        )
    }
    
    const update = (id, name, description) => {
        return dataAccessLayer.run(
            `UPDATE tasks SET 
                name = ?,
                description = ?,
                updatedAt = ?
            WHERE id = ?
            `,
            [name, description, now(), id]
        )
    }
    
    const destroy = (id) => {
        return dataAccessLayer.run(
            `DELETE from tasks WHERE id = ?`,
            [id]
        )
    }

    const complete = (id) => {
        return dataAccessLayer.run(
            `UPDATE tasks SET 
                isComplete = 1,
                updatedAt = ?
            WHERE id = ?
            `,
            [now(), id]
        )
    }

    return {
        createTable,
        all,
        findById,
        store,
        update,
        destroy,
        complete
    }
}

module.exports = taskRepository