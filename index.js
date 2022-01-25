const http = require('http');
const url = require('url');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const server = http.createServer((req, res) => {

    let { deportes } = JSON.parse(fs.readFileSync('deportes.json'));
    console.log(deportes);

    //abrir html
    if (req.url === ('/')) {
        return fs.readFile('index.html', (err, html) => {
            if(err) return res.end('error de lectura html');
            res.writeHead(200, {"Content-Type": "text/html"});
            return res.end(html);
        });
    }

    //leer deportes:
    if (req.url.includes('/deportes') && req.method === "GET") {
        res.end(JSON.stringify(deportes));
    }

    //crear archivo, agregar deportes (V1)
    if (req.url === '/deportes' && req.method === "POST") {

        let respuesta = ''
        req.on('data', (body) => {
            respuesta += body
        })

        req.on('end', () => {
            const deporte = JSON.parse(respuesta);
            deporte.id = uuidv4();
            deportes.push(deporte);
            console.log(deporte);

            fs.writeFile('deportes.json', JSON.stringify({deportes}), (err) => {
                res.writeHead(201, {"Content-Type": "application/json"})
                res.end(JSON.stringify(deportes));
                if (err) return res.end('Error al agregar deporte');
                res.end('Deporte agregado');
            });  
             
        });
    }

    //Editar precio
    if (req.url === '/deportes' && req.method == "PUT") {
        let respuesta = ''
        req.on('data', (body) => {
            respuesta += body
        })
        
        req.on('end', () => {
            const deporte = JSON.parse(respuesta);

            deportes = deportes.map(d => {
                if (d.nombre === deporte.nombre) {
                    d = deporte;
                }
                return d;
            })
    
            fs.writeFile('deportes.json', JSON.stringify({deportes}), (err) => {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(deportes));
                if (err) return res.end('Error al editar precio');
                res.end('Precio editado');
            });
        }); 
    }

    //Eliminar deporte
    if (req.url === '/deportes' && req.method === 'DELETE') {
        let respuesta = ''
        req.on('data', (body) => {
            respuesta += body
        })

        req.on('end', () => {
            const {nombre} = JSON.parse(respuesta);

            if(!nombre) return res.end('deporte no encontrado');

            deportes = deportes.filter((d) => d.nombre !== nombre);

            fs.writeFile('deportes.json', JSON.stringify({deportes}), (err) => {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(deportes));
                if (err) return res.end('Error al editar precio');
                res.end('Precio editado');
            });
        });
         
    }
});

server.listen(3000, () => console.log('Servidor OK'));

module.exports = server;