const form = document.getElementById("connexionForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const res = await fetch("/api/connexion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: form.email.value, password: form.password.value })
  });

  const data = await res.json();

  if (!res.ok) {
    message.textContent = data.error || "Erreur de connexion";
    return;
  }

  location.href = "/home";
});
