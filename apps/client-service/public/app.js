let API_BASE = 'http://localhost:3000/api';

// Fetch API Gateway URL from backend config on page load
fetch('/api/config')
  .then(res => res.json())
  .then(config => {
    API_BASE = `${config.apiGatewayUrl}/api`;
    console.log('API Base URL configured:', API_BASE);
  })
  .catch(err => {
    console.warn('Failed to fetch config, using default:', err);
  });

// Tab Management
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Status Management
function setStatus(message, type = '') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<div class="loading">⏳ Loading...</div>';
    element.className = 'result loading';
}

function showError(elementId, error) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
    element.className = 'result error';
}

function showSuccess(elementId, data, message = '') {
    const element = document.getElementById(elementId);
    let content = message ? `<div class="success-message">${message}</div>` : '';
    content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    element.innerHTML = content;
    element.className = 'result success';
}

// User CRUD Operations
async function createUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        fullName: formData.get('fullName') || undefined
    };

    setStatus('Creating user...', 'loading');

    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setStatus('✅ User created successfully!', 'success');
        form.reset();
        
        // Show created user
        showSuccess('userResult', data, '✅ User created:');
        
        // Refresh users list
        fetchAllUsers();
    } catch (error) {
        setStatus(`Failed to create user: ${error.message}`, 'error');
        showError('userResult', error.message);
    }
}

async function fetchAllUsers() {
    showLoading('usersList');
    setStatus('Fetching all users...', 'loading');

    try {
        const response = await fetch(`${API_BASE}/users`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
            document.getElementById('usersList').innerHTML = '<div class="empty">No users found. Create one above!</div>';
            document.getElementById('usersList').className = 'result';
        } else {
            showSuccess('usersList', data, `Found ${data.length} user(s):`);
        }
        setStatus(`Loaded ${data.length} user(s)`, 'success');
    } catch (error) {
        showError('usersList', error.message);
        setStatus('Failed to fetch users', 'error');
    }
}

async function fetchUserById() {
    const userId = document.getElementById('userId').value.trim();
    
    if (!userId) {
        setStatus('Please enter a User ID', 'error');
        return;
    }

    showLoading('userResult');
    setStatus('Fetching user...', 'loading');

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        showSuccess('userResult', data);
        setStatus('User fetched successfully!', 'success');
    } catch (error) {
        showError('userResult', error.message);
        setStatus('Failed to fetch user', 'error');
    }
}

// Order CRUD Operations
async function createOrder(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const orderData = {
        product: formData.get('product'),
        amount: parseFloat(formData.get('amount')),
        userId: formData.get('userId'),
        description: formData.get('description') || undefined
    };

    setStatus('Creating order...', 'loading');

    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setStatus('✅ Order created successfully!', 'success');
        form.reset();
        
        // Show created order
        showSuccess('orderResult', data, '✅ Order created:');
        
        // Refresh orders list
        fetchAllOrders();
    } catch (error) {
        setStatus(`Failed to create order: ${error.message}`, 'error');
        showError('orderResult', error.message);
    }
}

async function fetchAllOrders() {
    showLoading('ordersList');
    setStatus('Fetching all orders...', 'loading');

    try {
        const response = await fetch(`${API_BASE}/orders`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
            document.getElementById('ordersList').innerHTML = '<div class="empty">No orders found. Create one above!</div>';
            document.getElementById('ordersList').className = 'result';
        } else {
            showSuccess('ordersList', data, `Found ${data.length} order(s):`);
        }
        setStatus(`Loaded ${data.length} order(s)`, 'success');
    } catch (error) {
        showError('ordersList', error.message);
        setStatus('Failed to fetch orders', 'error');
    }
}

async function fetchOrderById() {
    const orderId = document.getElementById('orderId').value.trim();
    
    if (!orderId) {
        setStatus('Please enter an Order ID', 'error');
        return;
    }

    showLoading('orderResult');
    setStatus('Fetching order...', 'loading');

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Order not found');
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        showSuccess('orderResult', data);
        setStatus('Order fetched successfully!', 'success');
    } catch (error) {
        showError('orderResult', error.message);
        setStatus('Failed to fetch order', 'error');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    setStatus('Ready to manage users and orders', 'success');
    // Auto-load lists on page load
    fetchAllUsers();
    fetchAllOrders();
});
