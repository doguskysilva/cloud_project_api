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

    const all = () => dataAccessLayer.all(`SELECT * FROM tasks`);
    
    const findById = (id) => dataAccessLayer.get(`SELECT * FROM tasks WHERE id = ?`, [id])
    
    const store = (name, description) => {
        return dataAccessLayer.run(
            `INSERT into tasks (name, description, createdAt, updatedAt) values (?,?,?,?)`,
            [name, description, now(), now()]
        )
    }
    
    const update = () => {}
    
    const destroy = () => {}

    return {
        createTable,
        all,
        findById,
        store,
        update,
        destroy
    }
}

module.exports = taskRepository