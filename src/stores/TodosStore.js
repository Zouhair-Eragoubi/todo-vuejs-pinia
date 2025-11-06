import { defineStore } from 'pinia'
export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [],
    categories: [],
    currentCategory: undefined,
    completed: undefined,
    priority: undefined,
    sortBy: 'date',
    searchQuery: '',
    errors:[]
  }),
  getters: {
    allTodos: (state) => {
      let filteredTodos = state.todos.filter(todo => {
        const categoryMatch = state.currentCategory === undefined || 
          todo.category_id === state.currentCategory;
        const completionMatch = state.completed === undefined || 
          todo.completed === state.completed;
        const priorityMatch = state.priority === undefined || 
          todo.priority.toLowerCase() === state.priority.toLowerCase();
        const searchMatch = state.searchQuery === '' || 
          (todo.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
           todo.desc.toLowerCase().includes(state.searchQuery.toLowerCase()));
        
        return categoryMatch && completionMatch && priorityMatch && searchMatch;
      });

      // Sort todos based on sortBy value
      switch (state.sortBy) {
        case 'date':
          filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'priority': {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          filteredTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
          break;
        }
        case 'title':
          filteredTodos.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }

      return filteredTodos;
    },
    allCategories: (state) => {
      return state.categories;
    },
    currentCategoryCount: (state) => {
      return state.todos.length;
    },
    getCategoryTodosCount: (state) => (category) => {
      console.log('Getting todos count for category:', category, state.todos);
      if (category === undefined) {
        return state.todos.length;
      }
      console.log('Filtered todos for category 11 : ',category, state.todos.filter(todo => todo.category_id == category));
      return state.todos.filter(todo => todo.category_id == category).length;
    },
    getCompletedTodosCount: (state) => (completed) => {
      if (completed === undefined) {
        return state.todos.length;
      }
      return state.todos.filter(todo => todo.completed === completed).length;
    },
    getCurrentCategory: (state) => {
      return state.currentCategory;
    },
    getCurrentPriority: (state) => {
      return state.priority;
    },
    getCompletionStatus: (state) => {
      return state.completed;
    }
  },
  actions: {
    async addTodo(todo) {
        const response = await fetch('http://localhost:8000/api/todos/create', {  
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(todo)
        });
        const data = await response.json();
        console.log('Add todo response data:', data);
        console.log("error : ",data.errors);
        if(data.errors){
          console.error('Error adding todo:', data.errors);
          this.errors = data.errors;
          return;
        }
        console.log('Added todo response:', data);

        // Push the response data (which includes the ID from the database)
        this.todos.push(data.todo);
        this.errors = [];
    },
    setCategoryFilter(category) {
      this.currentCategory = category;
    },
    setCompletionFilter(completed) {
      this.completed = completed;
    },
    setPriorityFilter(priority) {
      this.priority = priority;
    },
    setSearchQuery(query) {
      this.searchQuery = query;
    },
    setSortBy(sortBy) {
      this.sortBy = sortBy;
    },
    removeTodo(todo) {
      this.todos = this.todos.filter(t => t !== todo);
    },
    async toggleTodoCompletion(todoId) {
      const id = typeof todoId === 'string' ? Number(todoId) : todoId;
      const response = await fetch(`http://localhost:8000/api/todos/toggle-completion/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if(data.error){
        console.error('Error toggling todo completion:', data.error);
        return;
      }

      const todos = this.todos.map(t => {
        if (t.id === id) {
          return { ...t, completed: !t.completed , updatedAt: new Date().toISOString() };
        }
        return t;
      });
      console.log('Toggled completion for todo ID:', todos);
      this.todos = todos;
    },
    deleteTodo(todoId) {
      this.todos = this.todos.filter(t => t.id !== todoId);
    },
    resetFilters() {
      this.completed = undefined;
      this.priority = undefined;
    },
    async loadTodos() {
      const response = await fetch('http://127.0.0.1:8000/api/todos',
        { method: 'GET' }
      );
      const data = await response.json();
      console.log('Fetched todos:', data);
      this.todos = data.todos;
    },
    async loadCategories() {
      const response = await fetch('http://127.0.0.1:8000/api/categories',
        { method: 'GET' }
      );
      const data = await response.json();
      console.log('Fetched cat:', data);
      this.categories = data.categories;
    }
  }
});