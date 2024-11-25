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

async function updateUIForAuth(user) {
    const authButton = document.getElementById('auth-button');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (user) {
        authButton.textContent = 'Sign Out';
        authButton.onclick = () => auth.signOut();
        userInfo.classList.remove('hidden');
        userName.textContent = user.displayName;
        userAvatar.src = user.photoURL;
    } else {
        authButton.textContent = 'Sign In';
        authButton.onclick = signInWithGoogle;
        userInfo.classList.add('hidden');
    }
}

async function loadUserTasks(userId) {
    const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
    );

    onSnapshot(tasksQuery, (snapshot) => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        snapshot.forEach((doc) => {
            const task = doc.data();
            const row = createTaskRow(doc.id, task);
            taskList.appendChild(row);
        });
    });
}

function createTaskRow(id, task) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${task.description}</td>
        <td>${new Date(task.startTime).toLocaleString()}</td>
        <td>${new Date(task.endTime).toLocaleString()}</td>
        <td>${task.location}</td>
        <td>
            <button class="btn btn-error btn-xs delete-task" data-id="${id}">Delete</button>
        </td>
    `;

    tr.querySelector('.delete-task').addEventListener('click', () => deleteTask(id));
    return tr;
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const formData = {
        description: document.getElementById('task-description').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        location: document.getElementById('location').value,
        userId: user.uid,
        createdAt: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, 'tasks'), formData);
        e.target.reset();
    } catch (error) {
        console.error('Error adding task:', error);
    }
} 