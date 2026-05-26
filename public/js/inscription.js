document.getElementById('inscriptionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                'confirm-password': confirmPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent =  data.message;
            document.getElementById('inscriptionForm').reset();
            setTimeout(() => {
                window.location.href = '/connexion';
            }, 2000);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent =  data.error;
        }
    } catch (err) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = err.message;
    }
});
