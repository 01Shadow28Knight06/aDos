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
