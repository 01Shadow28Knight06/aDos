const input = document.getElementById('tareaInput');
const boton = document.getElementById('btnAgregar');
const lista = document.getElementById('listaTareas');

// Función para guardar
function guardarEnStorage() {
    const tareas = [];
    document.querySelectorAll('#listaTareas li').forEach(li => {
        // Obtenemos solo el texto, ignorando el de la "X" del botón
        tareas.push(li.firstChild.textContent);
    });
    localStorage.setItem('misTareas', JSON.stringify(tareas));
    console.log("Guardado en Storage:", tareas);
}

// Función para crear el elemento visual
function renderizarTarea(texto) {
    const li = document.createElement('li');
    li.innerText = texto;

    const btn = document.createElement('button');
    btn.innerText = "X";
    btn.onclick = () => { 
        li.remove(); 
        guardarEnStorage(); 
    };

    li.appendChild(btn);
    lista.appendChild(li);
}

// Escuchar el click
boton.addEventListener('click', () => {
    if (input.value.trim() === "") return;
    renderizarTarea(input.value);
    guardarEnStorage();
    input.value = "";
});

// CARGAR AL INICIO (La clave del refresh)
window.onload = () => {
    const guardadas = JSON.parse(localStorage.getItem('misTareas')) || [];
    console.log("Cargando desde Storage:", guardadas);
    guardadas.forEach(t => renderizarTarea(t));
};

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        boton.click(); // Esto simula el clic cuando presionas Enter
    }
});
// Función para obtener el consejo de la API
async function obtenerConsejo() {
    console.log("Intentando conectar con la API..."); // Verificamos en consola
    try {
        const respuesta = await fetch('https://api.adviceslip.com/advice');
        const datos = await respuesta.json();
        
        console.log("Consejo recibido:", datos.slip.advice);

        // Creamos el elemento visual
        const header = document.querySelector('h1');
        const consejoTexto = document.createElement('p');
        consejoTexto.id = "api-frase";
        consejoTexto.innerHTML = `<small>💡 ${datos.slip.advice}</small>`;
        consejoTexto.style.color = "#4a90e2";
        consejoTexto.style.marginBottom = "15px";

        // Lo insertamos justo debajo del título "Pendientes"
        header.insertAdjacentElement('afterend', consejoTexto);
        
    } catch (error) {
        console.error("Fallo la API:", error);
    }
}

// Ejecutamos la función
obtenerConsejo();
