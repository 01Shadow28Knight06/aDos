class TodoApp {
    constructor() {
        this.state = JSON.parse(localStorage.getItem('pro_tasks')) || [];
        this.filter = 'all'; 
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

    setFilter(newFilter) {
        this.filter = newFilter;
        // Actualizar clase activa en botones
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-${newFilter}`).classList.add('active');
        this.render();
    }

    addTarea(text) {
        this.setState([...this.state, { id: Date.now().toString(), text, completed: false }]);
    }

    toggleTask(id) {
        this.setState(this.state.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }

    deleteTask(id) {
        this.setState(this.state.filter(t => t.id !== id));
    }

    render() {
        const lista = document.getElementById('listaTareas');
        lista.innerHTML = '';

        const filtradas = this.state.filter(t => {
            if (this.filter === 'pending') return !t.completed;
            if (this.filter === 'completed') return t.completed;
            return true;
        });

        filtradas.forEach(t => {
            const li = document.createElement('li');
            li.className = t.completed ? 'done' : '';
            li.innerHTML = `<span>${t.text}</span><button class="btn-del">X</button>`;
            li.onclick = () => this.toggleTask(t.id);
            li.querySelector('.btn-del').onclick = (e) => {
                e.stopPropagation();
                this.deleteTask(t.id);
            };
            lista.appendChild(li);
        });
    }

    async fetchAdvice() {
        try {
            const res = await fetch('https://api.adviceslip.com/advice');
            const { slip } = await res.json();
            const header = document.querySelector('h1');
            const existing = document.getElementById('api-frase');
            if (existing) existing.remove();
            const p = document.createElement('p');
            p.id = "api-frase";
            p.innerHTML = `<small>💡 ${slip.advice}</small>`;
            header.insertAdjacentElement('afterend', p);
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
}

window.app = new TodoApp();
