import { defineStore } from 'pinia'
import { useTodosStore } from './TodosStore'

const apiUrl = process.env.VUE_APP_API_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    errorMessage: ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  actions: {
    async login(credentials) {
      try {
        this.loading = true;
        this.errorMessage = '';

        const response = await fetch(`${apiUrl}login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        this.token = data.access_token;
        console.log('Login successful, token:', this.token);
        console.log('User data:', data.user);
        this.user = data.user;
        localStorage.setItem('token', data.access_token);

        return true;
      } catch (error) {
        this.errorMessage = error.message || 'Login failed. Please try again.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      try {
        this.loading = true;
        this.errorMessage = '';

        const response = await fetch(`${apiUrl}register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        this.token = data.access_token;
        console.log('Registration response user data:', data.user);
        this.user = data.user;
        localStorage.setItem('token', data.access_token);

        return true;
      } catch (error) {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await fetch(`${apiUrl}logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.token}`
            }
          });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');

        // Clear todos store data
        const todosStore = useTodosStore();
        todosStore.todos = [];
        todosStore.categories = [];
      }
    },

    async checkAuth() {
      if (!this.token) {
        return false;
      }

      try {
        const response = await fetch(`${apiUrl}user`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          this.logout();
          return false;
        }

        const data = await response.json();
        this.user = data;
        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    },

    clearError() {
      this.errorMessage = '';
    }
  }
});
