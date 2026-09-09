const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

const dbFile = './database.sqlite';
const dbExists = fs.existsSync(dbFile);

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error("Error al abrir DB:", err.message);
    db.run("PRAGMA foreign_keys = ON;");
});

if (!dbExists) {
    const initSql = fs.readFileSync('./company.sql', 'utf8');
    db.exec(initSql, (err) => {
        if (err) console.error("Error ejecutando company.sql:", err);
        else console.log("Base de datos inicializada desde company.sql");
    });
}


app.post('/api/productos', (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmtProd = db.prepare("INSERT INTO Producto (Nombre, Precio) VALUES (?, ?)");
        
        stmtProd.run([nombre, precio], function(err) {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Error al guardar producto" });
            }
            const nuevoProductoId = this.lastID;
            const stmtInv = db.prepare("INSERT INTO Inventario (productoId, cantidadInicial) VALUES (?, ?)");
            
            stmtInv.run([nuevoProductoId, cantidad], function(err) {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: "Error al guardar inventario" });
                }
                db.run("COMMIT");
                res.status(201).json({ message: "Producto creado", id: nuevoProductoId });
            });
            stmtInv.finalize();
        });
        stmtProd.finalize();
    });
});

app.get('/api/productos', (req, res) => {
    const query = `
        SELECT p.productoId, p.Nombre, p.Precio, i.cantidadInicial as Cantidad
        FROM Producto p
        LEFT JOIN Inventario i ON p.productoId = i.productoId
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad } = req.body;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run("UPDATE Producto SET Nombre = ?, Precio = ? WHERE productoId = ?", [nombre, precio, id], (err) => {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
            }
            db.run("UPDATE Inventario SET cantidadInicial = ? WHERE productoId = ?", [cantidad, id], (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                db.run("COMMIT");
                res.json({ message: "Producto actualizado correctamente" });
            });
        });
    });
});

app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run("DELETE FROM Inventario WHERE productoId = ?", id, (err) => {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
            }
            db.run("DELETE FROM Producto WHERE productoId = ?", id, (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                db.run("COMMIT");
                res.json({ message: "Producto eliminado correctamente" });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});