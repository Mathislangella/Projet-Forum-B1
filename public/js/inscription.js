const form = document.getElementById("inscriptionForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "";

  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirm = form["confirm-password"].value;

  if (password !== confirm) {
    message.textContent = "Les mots de passe ne correspondent pas";
    message.style.color = "red";
    return;
  }

  try {
    const res = await fetch("/inscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.error || "Erreur inscription";
      message.style.color = "red";
      return;
    }

    message.textContent = "Compte créé avec succès";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "/home";
    }, 500);

  } catch (err) {
    message.textContent = "Erreur serveur";
    message.style.color = "red";
  }
});