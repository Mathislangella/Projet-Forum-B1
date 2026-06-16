const form = document.getElementById("inscriptionForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const password = form.password.value;
  const confirm = form["confirm-password"].value;

  if (password !== confirm) {
    message.textContent = "Les mots de passe ne correspondent pas";
    return;
  }

  const res = await fetch("/api/inscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: form.username.value, email: form.email.value, password })
  });

  const data = await res.json();

  if (!res.ok) {
    message.textContent = data.error || "Erreur inscription";
    return;
  }

  location.href = "/connexion";
});
