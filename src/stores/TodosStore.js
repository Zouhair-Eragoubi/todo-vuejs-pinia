import { defineStore } from 'pinia'
export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [
            {
                id: 1,
                name: 'Complete project proposal',
                desc: 'Finish the Q4 project proposal and send to stakeholders',
                category: 'work',
                priority: 'high',
                dueDate: '2025-10-15',
                tags: ['urgent', 'meeting'],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Gym session',
                desc: 'Leg day workout',
                category: 'health',
                priority: 'medium',
                dueDate: '2025-10-09',
                tags: ['fitness'],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Buy groceries',
                desc: 'Milk, eggs, bread, vegetables',
                category: 'shopping',
                priority: 'low',
                dueDate: '2025-10-10',
                tags: ['shopping', 'weekly'],
                completed: true,
                createdAt: new Date().toISOString()
            }
        ]
        ,
    currentCategory: undefined,
    completed: undefined,
    priority: undefined,
    sortBy: 'date',
    searchQuery: ''
  }),
  getters: {
    allTodos: (state) => {
      let filteredTodos = state.todos.filter(todo => {
        const categoryMatch = state.currentCategory === undefined || 
          todo.category.toLowerCase() === state.currentCategory.toLowerCase();
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
    currentCategoryCount: (state) => {
      return state.todos.length;
    },
    getCategoryTodosCount: (state) => (category) => {
      console.log('Getting todos count for category:', category, state.todos);
      if (category === undefined) {
        return state.todos.length;
      }
      return state.todos.filter(todo => todo.category.toLocaleLowerCase() === category.toLocaleLowerCase()).length;
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
    addTodo(todo) {
      this.todos.push(todo);
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
    toggleTodoCompletion(todoId) {
      const id = typeof todoId === 'string' ? Number(todoId) : todoId;
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
    }
  }
});