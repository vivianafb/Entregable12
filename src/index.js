import express from 'express';
import routerProductos from './routes/productos.js'
import handlebars from 'express-handlebars'
import path from 'path';
import * as http from 'http';
import io from 'socket.io';

const app = express();
const puerto = 8080;

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

const layoutFolderPath = path.resolve(__dirname, '../views/layouts');
const defaultLayerPth = path.resolve(__dirname, '../views/layouts/index.hbs');
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({
    layoutsDir: layoutFolderPath,
    defaultLayout: defaultLayerPth,
    extname: 'hbs',
  })
);
const myServer = http.Server(app);

myServer.listen(puerto, () => console.log('Server up en puerto', puerto));

const myWSServer = io(myServer);

const messages = [];

myWSServer.on('connection',  (socket) =>{
  console.log('\n\nUn cliente se ha conectado');
    console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

  socket.on('new-message',  (data)=> {
    const newMessage = {
      message: data,
    };
    messages.push(newMessage);
    myWSServer.emit('messages', messages);
  });

  socket.on('askData', (data) => {
    console.log('ME LLEGO DATA');
    myWSServer.emit('messages', messages);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', routerProductos);