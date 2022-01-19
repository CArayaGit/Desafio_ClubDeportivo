const http = require('http');
const url = require('url');
const fs = require('fs');
const { userInfo } = require('os');


const server = http.createServer((req, res) => {

    let deportes = [];
    try {
        deportes = JSON.parse(fs.readFileSync('deportes.json'));
    } catch (error) {
        console.log('no se puede leer el archivo');
    }

    //crear archivo, agregar deportes:
    if (req.url.includes('/agregar')) {
        const {nombre, precio} = url.parse(req.url, true).query;

        deportes.push({nombre, precio});
        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            if (err) return res.end('error');
            res.end('Deporte agregado');
        });
    }

    //leer deportes:
    if (req.url.includes('/deportes')) {
        res.end(JSON.stringify(deportes));
    }

    //Eliminar deporte
    if (req.url.includes('/eliminar')) {
        const {nombre} = url.parse(req.url, true).query;
        if (!nombre) return res.end('Deporte no encontrado');

        deportes = deportes.filter((deporte) => deporte.nombre !== nombre);
        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            res.end('Deporte eliminado');
        });
    }

    //Editar precio
    if (req.url.includes('/editar')) {
        const {nombre, precio} = url.parse(req.url, true).query;

        deportes = deportes.map((deporte) => {
            if (deporte.nombre === nombre) {
                deporte.precio = precio;
            }
            return deporte;
        });

        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            if (err) return res.end('Error al editar precio');
            res.end('Precio editado');
        });
    }

    //abrir html
    if (req.url === ('/')) {
        return fs.readFile('index.html', (err, html) => {
            if(err) return res.end('error de lectura html');
            res.writeHead(200, {"Content-Type": "text/html"});
            return res.end(html);
        });

    }

});

server.listen(3000, () => console.log('Servidor OK'));