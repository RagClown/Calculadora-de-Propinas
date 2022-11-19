let cliente = {

    mesa:'',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);


function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo==='');

    if(camposVacios){
        //verificar si ya hay una alerta

        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son oblgiatorios'
            document.querySelector('.modal-body form').appendChild(alerta);
    
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
   
        return;
    }
     
    //asignar datos de formulario al cliente
    cliente = {...cliente,mesa, hora}
    // console.log(cliente)

    //conslutar modal

    const modalFormulario = document.querySelector('#formulario');
    const modalBootsrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootsrap.hide();

    //Mostrar las secciones
    mostrarSecciones();

    //Obtener Platillos de la API de JSON-server
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultad = document.querySelectorAll('.d-none');
    seccionesOcultad.forEach(seccion => seccion.classList.remove('d-none'))    
}

function obtenerPlatillos(){
    const url = 'http://localhost:3000/platillos';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then( resultado => mostrarPlatillos(resultado))
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo =>{
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const name = document.createElement('div');
        name.classList.add('col-md-4');
        name.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value =0;
        inputCantidad.id = `producto-${platillo.id}`
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el platillo que se está agregando
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad})
        }

        const agregar = document.createElement('div')
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(name);
        row.appendChild(precio);
        row.appendChild(categoria)
        row.appendChild(agregar)
        contenido.appendChild(row);
    })
}

function agregarPlatillo(producto){
    //Extrae el pedido actual
    let {pedido} = cliente;
    //Revisar que la cantidad sea mayor a 0
    if(producto.cantidad>0){
        //comprueba si el emento ya está en el array
        if(pedido.some( articulo => articulo.id === producto.id)){
            //El ariculo ya existe, actualizar la cantidad
            const pedidoActualizado = pedido.map(articulo=> {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            //Se asigna el nuevo array a Cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        }else{
            //El articulo no existe, se agrega al array de pedido
            cliente.pedido = [...pedido, producto];
        }
 
    }else{
        //Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id)
        cliente.pedido= [...resultado];
    }

    // Limpiar el HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        //Mostrar el resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div')
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');
    // Informacion de la hora
    const mesa = document.createElement('p')
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Informacion de la hora 
    const hora = document.createElement('p')
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');
    
    //Título de la seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos'
    heading.classList.add('my-4', 'text-center');
    
    //Iterar sobre el array
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    
    const { pedido } = cliente;
    pedido.forEach( articulo =>{
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad del artículo

        const cantidadEL = document.createElement('p');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = 'Cantidad: ';

        const cantidadVal = document.createElement('span');
        cantidadVal.classList.add('fw-normal');
        cantidadVal.textContent = cantidad;

        //Precio del artículo

        const precioEL = document.createElement('p');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = 'Precio: $';

        const precioVal = document.createElement('span');
        precioVal.classList.add('fw-normal');
        precioVal.textContent = precio;

        //Subtotal del artículo

        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal:';

        const subtotalVal = document.createElement('span');
        subtotalVal.classList.add('fw-normal');
        subtotalVal.textContent = calcularSubtotal(precio, cantidad);

        //Boton para eliminar

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del Pedido'

        //Funcion para eliminar del pedido
        btnEliminar.onclick = function(){
            eliminarProducto(id);
        }
      
        //agregar valres a sus contenedores
        cantidadEL.appendChild(cantidadVal);
        precioEL.appendChild(precioVal);
        subtotalEl.appendChild(subtotalVal);

        // Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);
        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    //Agregar a lso elemenos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    resumen.appendChild(heading);
    resumen.appendChild(mesa)
    resumen.appendChild(hora) 
    resumen.appendChild(grupo);

    contenido.appendChild(resumen)

    //Mostrar formulario de propinas
    formularioPropinas();
}

function limpiarHTML(){

    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad){
    return `$${precio*cantidad}`
}

function eliminarProducto(id){
    const {pedido} = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id)
    cliente.pedido= [...resultado];

    // Limpiar el HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        //Mostrar el resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    //El producto se elimino, hay que regersar a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value=0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center')
    texto.textContent = 'Añade los Elementos del pedido'

    contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario', );

    const divForm =  document.createElement('div');
    divForm.classList.add('card', 'py-2', 'px-3', 'shadow')

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio Button 10
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label')

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check')

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);
    
    //Radio Button 25
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label')

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check')

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //Radio Button 50
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label')

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check')

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    //Agregar al div principal
    divForm.appendChild(heading)
    divForm.appendChild(radio10Div)
    divForm.appendChild(radio25Div)
    divForm.appendChild(radio50Div)
    contenido.appendChild(formulario);

    //Agregregar al form
    formulario.appendChild(divForm);

}

function calcularPropina(){

    const {pedido} = cliente
    let subtotal = 0;

    //Calcular el subtotal a pagar
    pedido.forEach(articulo =>{
        subtotal += articulo.cantidad * articulo.precio;
    })

    //Selecciona rl radio Buton con la propina
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value
    
    //Calcular la propina
    const propina = ((subtotal* parseInt(propinaSeleccionada))/100)

    //Calcular el total
    const total = subtotal+propina;
 
    mostrarTotal(subtotal, total, propina);
}

function mostrarTotal(subtotal, total, propina){

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar')

    //Subtotal
    const subtotalP = document.createElement('p');
    subtotalP.classList.add('fs-3','fw-bold','mt-5');
    subtotalP.textContent = 'Subtotal Consumo';

    const subtotalSpan = document.createElement('span')
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalP.appendChild(subtotalSpan);

    //Propina
    const propinaP = document.createElement('p');
    propinaP.classList.add('fs-3','fw-bold','mt-3');
    propinaP.textContent = 'Propina';

    const propinaSpan = document.createElement('span')
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaP.appendChild(propinaSpan);

    //Total a pagar
    const totalP = document.createElement('p');
    totalP.classList.add('fs-3','fw-bold','mt-3');
    totalP.textContent = 'Total a pagar:';

    const totalSpan = document.createElement('span')
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalP.appendChild(totalSpan);

    //Eliminar el ultimo resultado

    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalP);
    divTotales.appendChild(propinaP);
    divTotales.appendChild(totalP);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales)
}