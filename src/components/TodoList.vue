<template>
    <div id="todoList">       
        <todo-item v-for="task in allTodos" :key="task.id" :task="task"></todo-item>
        <div v-if="allTodos.length === 0" id="emptyState" class="text-center py-5">
            <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
            <h4 class="text-muted">No tasks found</h4>
            <p class="text-muted">Add a new task to get started!</p>
        </div>
    </div>
</template>

<script setup>
import TodoItem from './TodoItem.vue';
import { storeToRefs } from 'pinia';
import { useTodosStore } from '../stores/TodosStore';

const store = useTodosStore();
const { allTodos } = storeToRefs(store);



</script>

<style>
</style>
