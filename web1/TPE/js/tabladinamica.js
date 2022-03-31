"use strict"

//BOTON AGRERGAR COMPRA A LA TABLA
let formulariocompra = document.querySelector("#form_compra");
formulariocompra.addEventListener("submit", agregarCompra);

//BOTON VACIAR TABLA (SOLO HTML Y ARREGLO)
let btn_vaciar = document.querySelector("#btn_vaciar");
btn_vaciar.addEventListener("click", vaciarTabla);

//BOTON BORRAR ULTIMO
let btn_borrarultimo = document.querySelector("#btn_borrarultimo");
btn_borrarultimo.addEventListener("click", borrarUltimoAPI);

//BOTON AGREGAR X 3
let btn_agregarx3 = document.querySelector("#btn_agregarx3");
btn_agregarx3.addEventListener("click", agregarx3);

//BOTON FILTRAR
let btn_filtrar = document.querySelector("#btn_filtrar");
btn_filtrar.addEventListener("click", function () {

    let inputBuscar = document.querySelector("#filtro");
    let filtro = inputBuscar.value.toLowerCase();
    let arreglotr = tbody.querySelectorAll("tr");

    if (filtro != "") {
        for (const tr of arreglotr) {
            let visible = false;
            let arreglotd = tr.querySelectorAll("td");
            for (const td of arreglotd) {
                if (td.innerHTML.toLowerCase().trim() == filtro) {
                    visible = true;
                }
            }
            if (visible == true) {
                tr.style.display = "";
            } else {
                tr.style.display = "none";
            }
        }
    } else {
        for (const tr of arreglotr) {
            tr.style.display = "";
        }
    }
});



let compras = []

let inputNombre = document.querySelector("#nombre");
let inputDireccion = document.querySelector("#direccion");
let inputSelect = document.querySelector("#select");
let inputCantidad = document.querySelector("#cantidad");
let inputCodigo = document.querySelector("#codigodescuento");


let tablaDinamica = document.querySelector("#tabladinamica");
let tbody = tablaDinamica.querySelector("tbody");

const url = 'https://60db1e91801dcb0017290e7d.mockapi.io/api/compra';
let ultimoid = "0";

console.table(compras);
obtenerDatos();



//AGRERGA LA COMPRA CON LOS DATOS INGRESADOS POR INPUTS (FORMULARIO)
function agregarCompra(e) {
    e.preventDefault();

    let nuevoId = parseInt(ultimoid) + 1;

    let compra = {
        nombre: inputNombre.value,
        direccion: inputDireccion.value,
        producto: inputSelect.value,
        cantidad: parseInt(inputCantidad.value),
        codigodescuento: inputCodigo.value,
        id: nuevoId.toString(),
    }

    agregarCompraAPI(compra);
}



//RECIBE POR PARAMETRO UN JSON CON LOS DATOS DE LA COMPRA
//AGREGA LA COMPRA A LA API, AL ARREGLO Y AL LA TABLA HTML
async function agregarCompraAPI(compra) {
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compra)
        });

        if (res.ok) {
            compras.push(compra);
            ultimoid = compras[compras.length - 1].id;
            mostrarItem(compra);
            console.table(compras);
        }
    } catch (error) {
        console.log(error);
    }
}



//AGREGA 3 VECES EL MISMO ELEMENTO EN EL ARREGLO Y EN LA TABLA DEL HTML (2DA ENTREGA)
function agregarx3(e) {
    let compra = {
        nombre: "Julio Borges",
        direccion: "Av. España 824",
        producto: "Espumante Dada",
        cantidad: "1",
        codigodescuento: "JK02",
    }
    for (let i = 0; i < 3; i++) {
        compras.push(compra);
        mostrarItem(compra);
    }
    console.table(compras);
}



//CARGA EN LA TABLA HTML LOS ELEMENTOS QUE YA SE ENCUENTRAN E
function mostrarArreglo() { //carga en la tabla html los elementos que ya se encuentran "precargados" en el arreglo
    for (const compra of compras) {
        mostrarItem(compra);
    }
}



//BORRA EL ULTIMO ELEMENTO DEL ARREGLO Y DEL LA TABLA HTML (2DA ENTREGA ADAPTADO A LA 3RA ENTREGA)
async function borrarUltimoAPI() {
    try {
        let res = await fetch(url + "/" + ultimoid, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        compras.splice(this.dataset.id, 1);
        console.table(compras);

        //BORRA EL ULTIMO ELEMENTO DEL ARREGLO Y DEL LA TABLA HTML (2DA ENTREGA)
        if (compras.length > 0) {
            compras.pop();
            tbody.lastChild.remove();
            console.table(compras);
        }

        //ultimoid = compras[compras.length - 1].id;
    } catch (error) {
        console.log(error);
    }
}



//BORRA TODOS LOS ELEMENTOS DEL ARREGLO Y DE LA TABLA HTML (2DA ENTREGA)
function vaciarTabla() {
    compras = [];
    console.table(compras);
    let filasTabla = document.querySelectorAll("tr");
    for (const fila of filasTabla) {
        if (fila.parentElement.tagName != "THEAD") {
            fila.remove();
        }
    };
}



//RECIBE POR PARAMETRO JSON CON LOS DATOS DE LA COMPRA
//AGREGA LA FILA A LA TABLA DE HTML 
function mostrarItem(compra) {
    tbody.innerHTML +=
        `<tr>
            <td> ${compra.nombre} </td>
            <td> ${compra.direccion} </td>
            <td> ${compra.producto} </td>
            <td> ${compra.cantidad} </td>
            <td> ${compra.codigodescuento} </td>
            <td> <button class="btnEliminar" data-id="${compra.id}"> Eliminar </button> <button class="btnEditar" data-id="${compra.id}"> Editar </button> </td>
        </tr>`;

    let listaBtnEliminar = document.querySelectorAll(".btnEliminar");
    for (const button of listaBtnEliminar) {
        button.addEventListener("click", function () {
            let idABorrar = this.dataset.id;
            let fila = this.parentElement.parentElement;
            borrarCompraAPI(idABorrar, fila);
        });
    }

    let listaBtnEditar = document.querySelectorAll(".btnEditar");
    for (const button of listaBtnEditar) {
        button.addEventListener("click", function () {
            let idAEditar = this.dataset.id;
            let fila = this.parentElement.parentElement;
            editarCompra(idAEditar, fila);
        })
    }

    if (compra.cantidad >= 2 && compra.cantidad <= 5) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a amarillo
        tbody.lastChild.classList.toggle("cantidadentre2y5");
    } else if (compra.cantidad >= 6) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a verde
        tbody.lastChild.classList.toggle("cantidadmayora5");
    }
}



//RECIBE POR PARAMETRO EL ID Y LA FILA DEL HTML, DE LA COMPRA
//LLAMA LA FUNCION editarCompraAPI PARA EFECTUAR LOS CAMBIOS
function editarCompra(id, fila) {
    let celdas = fila.querySelectorAll("td");

    //CARGA INPUTS CON DATOS DE LA FILA
    inputNombre.value = celdas[0].innerHTML.trim();
    inputDireccion.value = celdas[1].innerHTML.trim();
    inputSelect.value = celdas[2].innerHTML.trim();
    inputCantidad.value = celdas[3].innerHTML.trim();
    inputCodigo.value = celdas[4].innerHTML.trim();

    //OCULTA BOTON AGREGAR
    let btnAgregar = document.querySelector("#btn_agregar");
    btnAgregar.style.display = "none";

    //AGREGA Y ASIGNA FUNCIONAMIENTO A BOTONES GUARDAR Y CANCELAR
    document.querySelector("#botonesEditar").innerHTML =
        `<button id="btnGuardar"> GUARDAR </button> <button id="btnCancelar"> CANCELAR </button>`;
    document.querySelector("#btnGuardar").addEventListener("click", function () {
        let compraEditada = {
            nombre: inputNombre.value,
            direccion: inputDireccion.value,
            producto: inputSelect.value,
            cantidad: parseInt(inputCantidad.value),
            codigodescuento: inputCodigo.value,
            id: id,
        }
        editarCompraAPI(compraEditada, celdas);
        btnAgregar.style.display = "flex";
        document.querySelector("#botonesEditar").innerHTML = "";
    });
    document.querySelector("#btnCancelar").addEventListener("click", function () {
        btnAgregar.style.display = "flex";
        document.querySelector("#botonesEditar").innerHTML = "";
        vaciarInputs();
    });
}



//RECIBE: UN JSON DE LA COMPRA CON LOS CAMPOS EDITADOS Y LA REFERENCIA A LAS CELDAS DE LA FILA DEL HTML
//EDITA LOS DATOS DE LA COMPRA EN LA API Y LUEGO EN EL ARREGLO Y HTML
async function editarCompraAPI(compra, celdas) {
    try {
        let res = await fetch(url + "/" + compra.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compra)
        });

        if (res.ok) {
            let pos = 0;

            //BUSCA LA POSICION DE LA COMPRA EN EL ARREGLO
            for (let index = 0; index < compras.length; index++) {
                if (compras[index].id == compra.id) {
                    pos = index;
                    break;
                }
            }

            //EDITA LA COMPRA EN EL ARREGLO
            compras[pos] = compra;

            //EDITA LA COMPRA EN EL HTML
            celdas[0].innerHTML = compra.nombre;
            celdas[1].innerHTML = compra.direccion;
            celdas[2].innerHTML = compra.producto;
            celdas[3].innerHTML = compra.cantidad;
            celdas[4].innerHTML = compra.codigodescuento;

            //CAMBIA COLOR DE LA FILA EDITADA
            let fila = celdas[0].parentElement;
            if (compra.cantidad == 1) {
                fila.classList.remove("cantidadentre2y5");
                fila.classList.remove("cantidadmayora5");
                fila.style.backgroundColor = 'white';
            } else if (compra.cantidad >= 2 && compra.cantidad <= 5) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a amarillo
                fila.classList.toggle("cantidadentre2y5");
            } else if (compra.cantidad >= 6) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a verde
                fila.classList.toggle("cantidadmayora5");
            }

            vaciarInputs();
            console.table(compras);
        }
    } catch (error) {
        console.log(error);
    }
}



//OBTIENE LOS DATOS DE LA API, LOS AGREGAR AL ARREGLO Y A LA TABLA HTML
async function obtenerDatos() {
    try {
        let res = await fetch(url);
        let json = await res.json();
        for (const compra of json) {
            compras.push(compra);
        }
        if (compras.length != 0) {
            ultimoid = compras[compras.length - 1].id;
            mostrarArreglo();
            console.table(compras);
        }
    } catch (error) {
        console.log(error);
    }
}



//RECIBE POR PARAMETRO EL ID Y LA FILA DEL HTML, DE LA COMPRA A BORRAR
//BORRA LA COMPRA DE LA API, DEL ARREGLO Y DE LA TABLA HTML
async function borrarCompraAPI(id, fila) { //borra de la API, del arreglo y del HTML, la compra con el id y la fila(elemento HTML) pasados por parametro
    try {
        let res = await fetch(url + "/" + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            let pos = 0;
            for (let index = 0; index < compras.length; index++) { //busca la posición de la compra en el arreglo
                if (compras[index].id == id) {
                    pos = index;
                    break;
                }
            }
            compras.splice(pos, 1); //elimina la compra del arreglo
            fila.remove(); //elimina la fila del HTML
            if (id == ultimoid){
                ultimoid--;
            }
            console.table(compras);
        }
    } catch (error) {
        console.log(error);
    }
}



//VACIA EL CONTENIDO DE LOS INPUTS
function vaciarInputs() {
    inputNombre.value = "";
    inputDireccion.value = "";
    inputSelect.value = "";
    inputCantidad.value = "";
    inputCodigo.value = "";
}