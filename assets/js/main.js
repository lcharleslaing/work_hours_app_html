import { auth, db } from './firebase.js';
import { collection, addDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Load components
document.addEventListener('DOMContentLoaded', async () => {
    const components = ['header', 'task-form', 'task-list'];
    for (const component of components) {
        const response = await fetch(`/components/${component}.html`);
        const html = await response.text();
        document.getElementById(`${component}-container`)?.innerHTML = html;
    }

    initializeEventListeners();
    initializeAuthStateListener();
});

function initializeEventListeners() {
    const taskForm = document.getElementById('task-form');
    taskForm?.addEventListener('submit', handleTaskSubmit);

    const exportBtn = document.getElementById('export-btn');
    exportBtn?.addEventListener('click', handleExport);

    const discordBtn = document.getElementById('discord-btn');
    discordBtn?.addEventListener('click', sendToDiscord);
}

function initializeAuthStateListener() {
    auth.onAuthStateChanged((user) => {
        updateUIForAuth(user);
        if (user) {
            loadUserTasks(user.uid);
        }
    });
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    // Task submission logic will be implemented when Firebase is connected
} 