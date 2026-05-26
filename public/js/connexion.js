document.getElementById('connexionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = '✅ ' + data.message;
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => {
                window.location.href = '/home';
            }, 2000);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = '❌ ' + data.error;
        }
    } catch (err) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = '❌ Erreur: ' + err.message;
    }
});
