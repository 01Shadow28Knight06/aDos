class TodoApp {
    constructor() {
        this.state = JSON.parse(localStorage.getItem('pro_tasks')) || [];
        this.init();
    }

    init() {
        this.render();
        this.fetchAdvice();
        this.setupEventListeners();
    }

    setState(newState) {
        this.state = newState;
        localStorage.setItem('pro_tasks', JSON.stringify(this.state));
        this.render();
    }

    async fetchAdvice() {
        try {
            const res = await fetch('https://api.adviceslip.com/advice');
            const { slip } = await res.json();
            const header = document.querySelector('h1');
            const existing = document.getElementById('api-frase');
            if (existing) existing.remove();
            const consejo = document.createElement('p');
            consejo.id = "api-frase";
            consejo.innerHTML = `<small>💡 ${slip.advice}</small>`;
            header.insertAdjacentElement('afterend', consejo);
        } catch (e) { console.error("API Error"); }
    }

    setupEventListeners() {
        const input = document.getElementById('tareaInput');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.addTarea(input.value.trim());
                input.value = '';
            }
        });

        document.getElementById('btnAgregar').onclick = () => {
            if (input.value.trim()) {
                this.addTarea(input.value.trim());
                input.value = '';
            }
        };
    }

    addTarea(text) {
        this.setState([...this.state, { id: Date.now().toString(), text, completed: false }]);
    }

    toggleTask(id) {
        const updated = this.state.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        this.setState(updated);
    }

    deleteTask(id) {
        this.setState(this.state.filter(t => t.id !== id));
    }

    render() {
        const lista = document.getElementById('listaTareas');
        lista.innerHTML = ''; // Limpiamos la lista
        
        this.state.forEach(t => {
            const li = document.createElement('li');
            li.className = t.completed ? 'done' : '';
            li.innerHTML = `
                <span>${t.text}</span>
                <button class="btn-del">X</button>
            `;
            
            // Evento para tachar (asignado directamente al elemento)
            li.onclick = () => this.toggleTask(t.id);
            
            // Evento para borrar
            li.querySelector('.btn-del').onclick = (e) => {
                e.stopPropagation();
                this.deleteTask(t.id);
            };
            
            lista.appendChild(li);
        });
    }
}

// Inicializamos la app
const app = new TodoApp();
