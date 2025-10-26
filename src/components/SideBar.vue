<template>
    <div class="sidebar">
        <category-title title="All Tasks" icon="fas fa-inbox"></category-title>

        <category-item title="All Tasks" icon="fas fa-inbox" ></category-item>
        <category-item title="Work" icon="briefcase" category="work"></category-item>
        <category-item title="Personal" icon="user" category="personal"></category-item>
        <category-item title="Shopping" icon="shopping-cart" category="shopping"></category-item>
        <category-item title="Health" icon="heartbeat" category="health"></category-item>

        <hr>

        <category-title title="Progress" icon="fas fa-chart-pie"></category-title>
        <chart-comp></chart-comp>
    </div>
</template>

<script setup>
import CategoryItem from './CategoryItem.vue'
import CategoryTitle from './CategoryTitle.vue';
import ChartComp from './ChartComp.vue'
</script>

<style>
.sidebar {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    height: fit-content;
    position: sticky;
    top: 20px;
}

.category-item {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.category-item:hover {
    background: #f0f0f0;
}

.category-item.active {
    background: var(--primary-gradient);
    color: white;
}
</style>
