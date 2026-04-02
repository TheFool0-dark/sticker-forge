const USERS_KEY = "sticker-orbit-users-v1";
const SESSION_KEY = "sticker-orbit-session-v1";

const authState = {
  mode: "signin"
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#authForm")) {
    setupAuthPage();
  }

  syncSiteAuthUi();
});

function setupAuthPage() {
  const els = {
    form: document.querySelector("#authForm"),
    signInTab: document.querySelector("#signInTab"),
    signUpTab: document.querySelector("#signUpTab"),
    switchModeButton: document.querySelector("#switchModeButton"),
    clearSessionButton: document.querySelector("#clearSessionButton"),
    cardLabel: document.querySelector("#cardLabel"),
    cardTitle: document.querySelector("#cardTitle"),
    cardCopy: document.querySelector("#cardCopy"),
    switchPrompt: document.querySelector("#switchPrompt"),
    submitButton: document.querySelector("#submitButton"),
    authMessage: document.querySelector("#authMessage"),
    displayName: document.querySelector("#displayName"),
    email: document.querySelector("#email"),
    password: document.querySelector("#password"),
    confirmPassword: document.querySelector("#confirmPassword"),
    rememberMe: document.querySelector("#rememberMe"),
    signupOnly: Array.from(document.querySelectorAll(".signup-only"))
  };

  const session = getSession();
  if (session) {
    showMessage(els.authMessage, `Signed in as ${session.displayName}. You can go back to the studio now.`, "success");
  }

  els.signInTab.addEventListener("click", () => setMode("signin", els));
  els.signUpTab.addEventListener("click", () => setMode("signup", els));
  els.switchModeButton.addEventListener("click", () => {
    setMode(authState.mode === "signin" ? "signup" : "signin", els);
  });

  els.clearSessionButton.addEventListener("click", () => {
    clearSession();
    showMessage(els.authMessage, "Session cleared for this browser.", "success");
    syncSiteAuthUi();
  });

  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (authState.mode === "signup") {
      handleSignUp(els);
      return;
    }
    handleSignIn(els);
  });

  setMode("signin", els);
}

function setMode(mode, els) {
  authState.mode = mode;
  const signup = mode === "signup";

  els.signInTab.classList.toggle("is-active", !signup);
  els.signUpTab.classList.toggle("is-active", signup);
  els.cardLabel.textContent = signup ? "Create Account" : "Member Login";
  els.cardTitle.textContent = signup ? "Create your account" : "Sign in";
  els.cardCopy.textContent = signup
    ? "Create a browser-based Sticker Orbit account to save a working session."
    : "Enter your details below to access your account.";
  els.switchPrompt.textContent = signup ? "Already have an account?" : "New here?";
  els.switchModeButton.textContent = signup ? "Sign in instead" : "Create an account";
  els.submitButton.textContent = signup ? "Create account" : "Login";

  for (const node of els.signupOnly) {
    node.hidden = !signup;
    if ("required" in node) node.required = signup;
  }

  els.confirmPassword.value = "";
  hideMessage(els.authMessage);
}

function handleSignUp(els) {
  const displayName = els.displayName.value.trim();
  const email = normalizeEmail(els.email.value);
  const password = els.password.value;
  const confirmPassword = els.confirmPassword.value;

  if (!displayName || displayName.length < 2) {
    showMessage(els.authMessage, "Display name must be at least 2 characters.", "error");
    return;
  }

  if (!email) {
    showMessage(els.authMessage, "Enter a valid email address.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage(els.authMessage, "Password must be at least 6 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(els.authMessage, "Passwords do not match.", "error");
    return;
  }

  const users = getUsers();
  if (users.some((user) => user.email === email)) {
    showMessage(els.authMessage, "That email already has an account. Sign in instead.", "error");
    return;
  }

  const user = {
    id: makeId(),
    displayName,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);
  saveSession(user, els.rememberMe.checked);
  showMessage(els.authMessage, `Account created. Signed in as ${user.displayName}.`, "success");
  els.form.reset();
  syncSiteAuthUi();
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 900);
}

function handleSignIn(els) {
  const email = normalizeEmail(els.email.value);
  const password = els.password.value;
  const users = getUsers();
  const user = users.find((entry) => entry.email === email);

  if (!user || user.passwordHash !== hashPassword(password)) {
    showMessage(els.authMessage, "Invalid email or password.", "error");
    return;
  }

  saveSession(user, els.rememberMe.checked);
  showMessage(els.authMessage, `Welcome back, ${user.displayName}.`, "success");
  syncSiteAuthUi();
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 700);
}

function syncSiteAuthUi() {
  const session = getSession();
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  navActions.innerHTML = "";

  if (session) {
    const tag = document.createElement("span");
    tag.className = "auth-badge";
    tag.textContent = session.displayName;

    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "btn btn-ghost btn-small";
    logout.textContent = "Logout";
    logout.addEventListener("click", () => {
      clearSession();
      syncSiteAuthUi();
      window.location.reload();
    });

    const studio = document.createElement("a");
    studio.className = "btn btn-primary btn-small";
    studio.href = "#builder";
    studio.textContent = "Launch studio";

    navActions.append(tag, logout, studio);
    return;
  }

  const login = document.createElement("a");
  login.className = "btn btn-ghost btn-small";
  login.href = "./login.html";
  login.textContent = "Login";

  const studio = document.createElement("a");
  studio.className = "btn btn-primary btn-small";
  studio.href = "#builder";
  studio.textContent = "Launch studio";

  navActions.append(login, studio);
}

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user, remember) {
  const payload = JSON.stringify({
    id: user.id,
    displayName: user.displayName,
    email: user.email
  });
  sessionStorage.setItem(SESSION_KEY, payload);
  if (remember) {
    localStorage.setItem(SESSION_KEY, payload);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return email.includes("@") ? email : "";
}

function showMessage(node, message, kind) {
  node.hidden = false;
  node.textContent = message;
  node.className = `auth-message is-${kind}`;
}

function hideMessage(node) {
  node.hidden = true;
  node.textContent = "";
  node.className = "auth-message";
}

function hashPassword(value) {
  let hash = 0;
  const input = String(value);
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function makeId() {
  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
