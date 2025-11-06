<template>
  <div class="container main-container">
        <div class="row g-4">
            <!-- Sidebar -->
            <div class="col-lg-3">
                <side-bar></side-bar>
            </div>
            
            <!-- Main Content -->
            <div class="col-lg-9">
                <header-bar></header-bar>
                <main-content></main-content>
            </div>
        </div>
    </div>
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SideBar from './components/SideBar.vue';
import HeaderBar from './components/HeaderBar.vue';
import MainContent from './components/MainContent.vue';
import { useTodosStore } from './stores/TodosStore';

import { onMounted } from 'vue';

const todosStore = useTodosStore(); 

onMounted(() => {
  todosStore.loadCategories();
  todosStore.loadTodos();
});


</script>

<style>
  :root {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      --danger-gradient: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      --warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
        
  body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
</style>
