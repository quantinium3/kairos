import db from "./database";

const createItem = (username, description, callback) => {
    const sql = `INSERT INTO users (username, description) VALUES (?, ?)`
    db.run(sql, { username, description }, function(err) {
        callback(err, { id: this.lastID })
    })
}

const readItems = (callback) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, {}, callback)
}

const updateItems = (id, username, description, callback) => {
    const sql = `UPDATE users SET name = ?, description = ? WHERE id = ?`
    db.run(sql, { username, description, id }, callback)
}

const deleteItem = (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`
    db.run(sql, id, callback)
}

export { createItem, readItems, updateItems, deleteItem };
