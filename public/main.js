
const socket = io.connect();

// Cuando arrancamos pedimos la data que hay actualmente enviando un socket
socket.emit('askData');

function sendData(e) {
let mensaje = {
   nombre: document.getElementById('nombre').value,
   precio: document.getElementById('precio').value,
   foto: document.getElementById('foto').value,
}
  socket.emit('new-message', mensaje);

}

function render(data) {
  var html = data
    .map(function (elem, index) {
        return `<tr><td>${JSON.stringify(elem.message.nombre)}</td>
        <td>${JSON.stringify(elem.message.precio)}</td>
        <td><img src="${JSON.stringify(elem.message.foto)}" alt="x" width="80px" height="70px"></td></tr>`
        
    })
    .join(' ');

  document.getElementById('messages').innerHTML = html;
}

socket.on('messages', (data) => {
  console.log('RECIBI MENSAJE');
 render(data);
});