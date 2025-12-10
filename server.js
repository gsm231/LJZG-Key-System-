const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Base de datos simple en memoria
let activeKeys = {}; // { key : { hwid, used } }

// ------------------------------
//  RUTA PARA OBTENER UNA KEY
// ------------------------------
app.get("/getkey", (req, res) => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();

    activeKeys[key] = {
        hwid: null,
        used: false
    };

    console.log("[Nueva Key Generada]:", key);

    res.json({
        success: true,
        key: key
    });
});

// ------------------------------
//   VALIDAR KEY DESDE ROBLOX
// ------------------------------
app.post("/validate", (req, res) => {
    const { key, hwid } = req.body;

    if (!key || !hwid) {
        return res.json({ success: false, message: "Faltan parámetros" });
    }

    const data = activeKeys[key];

    if (!data) {
        return res.json({ success: false, message: "La key no existe" });
    }

    // Primera vez que se usa → asignamos HWID
    if (!data.hwid) {
        data.hwid = hwid;
        data.used = true;

        console.log("[Key Activada]:", key, "HWID:", hwid);

        return res.json({
            success: true,
            message: "Key activada por primera vez"
        });
    }

    // La key pertenece a otro jugador
    if (data.hwid !== hwid) {
        return res.json({
            success: false,
            message: "Esta key ya está ligada a otro dispositivo"
        });
    }

    // Key válida
    return res.json({ success: true, message: "Key válida" });
});

// ------------------------------
app.get("/", (req, res) => {
    res.send("Servidor de Keys corriendo correctamente.");
});

// ------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto", PORT);
});
