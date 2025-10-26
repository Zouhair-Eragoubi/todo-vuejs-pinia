<template>
    <button class="btn btn-light" @click="openOrCloseModal">
        <i class="fas fa-plus me-2"></i>New Task
    </button>
    <div
        class="modal fade"
        :class="{ show: showModal }"
        role="dialog"
        id="taskModal"
        tabindex="-1"
        aria-labelledby="taskModalLabel"
        aria-hidden="true"
        ref="modalRef"
        v-if="showModal"
        style="display: block; background: rgba(0,0,0,0.5);"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary">
                    <h5 class="modal-title " id="taskModalLabel">
                        <i class="fas fa-plus-circle me-2"></i>Add New Task
                    </h5>
                    <button type="button" class="btn-close btn-close-white" @click="openOrCloseModal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Task Name *</label>
                        <input type="text" class="form-control" v-model="newTask.name" placeholder="Enter task name">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="newTask.description" rows="3" placeholder="Add details..."></textarea>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Category *</label>
                            <select class="form-select" v-model="newTask.category">
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="shopping">Shopping</option>
                                <option value="health">Health</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Priority *</label>
                            <select class="form-select" v-model="newTask.priority">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Due Date</label>
                        <input type="date" class="form-control" v-model="newTask.dueDate">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Tags (comma separated)</label>
                        <input type="text" class="form-control" v-model="newTask.tags" placeholder="e.g., urgent, meeting, report">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="openOrCloseModal">
                        <i class="fas fa-times me-2"></i>Cancel
                    </button>
                    <button type="button" class="btn btn-primary" @click="addTask">
                        <i class="fas fa-plus me-2"></i>Add Task
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useTodosStore } from '../stores/TodosStore';

const todosStore = useTodosStore();

const modalRef = ref(null)
const showModal = ref(false)
const newTask = reactive({
  name: '',
  description: '',
  category: 'work',
  priority: 'medium',
  dueDate: '',
  tags: ''
})


function resetForm() {
  newTask.name = ''
  newTask.description = ''
  newTask.category = 'work'
  newTask.priority = 'medium'
  newTask.dueDate = ''
  newTask.tags = ''
}

function openOrCloseModal() {
  showModal.value = !showModal.value
  if (!showModal.value) resetForm()
}

function addTask() {
  if (!newTask.name.trim()) {
    alert('Task name is required.')
    return
  }
  const taskToAdd = {
    name: newTask.name,
    description: newTask.description,
    category: newTask.category,
    priority: newTask.priority,
    dueDate: newTask.dueDate,
    tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()).filter(Boolean) : []
  }
  console.log('Adding task:', taskToAdd);
  todosStore.addTodo(taskToAdd);
  openOrCloseModal()
}
</script>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
}

.modal.show {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
    margin: 1.75rem auto;
}

.modal-content {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn-close-white {
    filter: brightness(0) invert(1);
}
</style>
