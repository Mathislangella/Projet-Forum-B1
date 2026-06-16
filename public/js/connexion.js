const form = document.getElementById("connexionForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "";

  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("/connexion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.error || "Erreur de connexion";
      message.style.color = "red";
      return;
    }

    message.textContent = "Connexion réussie";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "/home";
    }, 500);

  } catch (err) {
    message.textContent = "Erreur serveur";
    message.style.color = "red";
  }
});