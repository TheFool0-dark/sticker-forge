const LOCAL_USERS_KEY = "sticker-orbit-users-v1";
const LOCAL_SESSION_KEY = "sticker-orbit-session-v1";

const authState = {
  mode: "signin",
  provider: null
};

document.addEventListener("DOMContentLoaded", async () => {
  authState.provider = createAuthProvider();
  await authState.provider.init();

  if (document.querySelector("#authForm")) {
    setupAuthPage();
  }

  await syncSiteAuthUi();
});

function createAuthProvider() {
  const config = window.STICKER_ORBIT_SUPABASE || {};
  const hasSupabase =
    Boolean(window.supabase?.createClient) &&
    typeof config.url === "string" &&
    typeof config.anonKey === "string" &&
    config.url.trim() &&
    config.anonKey.trim();

  return hasSupabase ? createSupabaseProvider(config) : createLocalProvider();
}

function createSupabaseProvider(config) {
  const client = window.supabase.createClient(config.url, config.anonKey);

  return {
    kind: "supabase",
    async init() {
      await client.auth.getSession();
    },
    async getSession() {
      const { data } = await client.auth.getSession();
      const user = data.session?.user;
      if (!user) return null;
      return {
        id: user.id,
        displayName: user.user_metadata?.display_name || user.email?.split("@")[0] || "Orbit user",
        email: user.email || ""
      };
    },
    async signUp({ displayName, email, password }) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: config.redirectUrl || window.location.origin,
          data: {
            display_name: displayName
          }
        }
      });
      if (error) throw error;
      const user = data.user;
      return {
        user: user
          ? {
              id: user.id,
              displayName: user.user_metadata?.display_name || displayName,
              email: user.email || email
            }
          : null,
        needsEmailConfirmation: !data.session
      };
    },
    async signIn({ email, password }) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user;
      return {
        user: {
          id: user.id,
          displayName: user.user_metadata?.display_name || user.email?.split("@")[0] || "Orbit user",
          email: user.email || email
        }
      };
    },
    async signOut() {
      await client.auth.signOut();
    },
    async clearSession() {
      await client.auth.signOut();
    }
  };
}

function createLocalProvider() {
  return {
    kind: "local",
    async init() {},
    async getSession() {
      try {
        const raw = localStorage.getItem(LOCAL_SESSION_KEY) || sessionStorage.getItem(LOCAL_SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    async signUp({ displayName, email, password, remember }) {
      const users = getLocalUsers();
      if (users.some((user) => user.email === email)) {
        throw new Error("That email already has an account. Sign in instead.");
      }

      const user = {
        id: makeId(),
        displayName,
        email,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
      };

      users.push(user);
      saveLocalUsers(users);
      saveLocalSession(user, remember);
      return { user, needsEmailConfirmation: false };
    },
    async signIn({ email, password, remember }) {
      const users = getLocalUsers();
      const user = users.find((entry) => entry.email === email);
      if (!user || user.passwordHash !== hashPassword(password)) {
        throw new Error("Invalid email or password.");
      }

      saveLocalSession(user, remember);
      return { user };
    },
    async signOut() {
      clearLocalSession();
    },
    async clearSession() {
      clearLocalSession();
    }
  };
}

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
    providerHint: document.querySelector("#providerHint"),
    displayName: document.querySelector("#displayName"),
    email: document.querySelector("#email"),
    password: document.querySelector("#password"),
    confirmPassword: document.querySelector("#confirmPassword"),
    rememberMe: document.querySelector("#rememberMe"),
    signupOnly: Array.from(document.querySelectorAll(".signup-only"))
  };

  els.providerHint.textContent = authState.provider.kind === "supabase"
    ? "Auth mode: Supabase cloud account"
    : "Auth mode: local browser account";

  authState.provider.getSession().then((session) => {
    if (session) {
      showMessage(els.authMessage, `Signed in as ${session.displayName}. You can go back to the studio now.`, "success");
    }
  });

  els.signInTab.addEventListener("click", () => setMode("signin", els));
  els.signUpTab.addEventListener("click", () => setMode("signup", els));
  els.switchModeButton.addEventListener("click", () => setMode(authState.mode === "signin" ? "signup" : "signin", els));
  els.clearSessionButton.addEventListener("click", async () => {
    await authState.provider.clearSession();
    showMessage(els.authMessage, "Session cleared.", "success");
    await syncSiteAuthUi();
  });

  els.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (authState.mode === "signup") {
      await handleSignUp(els);
      return;
    }
    await handleSignIn(els);
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
    ? "Create a Sticker Orbit account so your users can sign back in later."
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

async function handleSignUp(els) {
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

  try {
    const result = await authState.provider.signUp({
      displayName,
      email,
      password,
      remember: els.rememberMe.checked
    });

    if (result.needsEmailConfirmation) {
      showMessage(els.authMessage, "Account created. Check your email to confirm your account, then sign in.", "success");
      els.form.reset();
      return;
    }

    showMessage(els.authMessage, `Account created. Signed in as ${result.user.displayName}.`, "success");
    els.form.reset();
    await syncSiteAuthUi();
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 900);
  } catch (error) {
    showMessage(els.authMessage, cleanAuthError(error), "error");
  }
}

async function handleSignIn(els) {
  const email = normalizeEmail(els.email.value);
  const password = els.password.value;

  try {
    const result = await authState.provider.signIn({
      email,
      password,
      remember: els.rememberMe.checked
    });
    showMessage(els.authMessage, `Welcome back, ${result.user.displayName}.`, "success");
    await syncSiteAuthUi();
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 700);
  } catch (error) {
    showMessage(els.authMessage, cleanAuthError(error), "error");
  }
}

async function syncSiteAuthUi() {
  const session = await authState.provider.getSession();
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  navActions.innerHTML = "";

  if (session) {
    const tag = document.createElement("span");
    tag.className = "auth-badge";
    tag.textContent = `${session.displayName}${authState.provider.kind === "supabase" ? " • cloud" : ""}`;

    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "btn btn-ghost btn-small";
    logout.textContent = "Logout";
    logout.addEventListener("click", async () => {
      await authState.provider.signOut();
      await syncSiteAuthUi();
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
  login.textContent = authState.provider.kind === "supabase" ? "Cloud login" : "Login";

  const studio = document.createElement("a");
  studio.className = "btn btn-primary btn-small";
  studio.href = "#builder";
  studio.textContent = "Launch studio";

  navActions.append(login, studio);
}

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function saveLocalSession(user, remember) {
  const payload = JSON.stringify({
    id: user.id,
    displayName: user.displayName,
    email: user.email
  });
  sessionStorage.setItem(LOCAL_SESSION_KEY, payload);
  if (remember) {
    localStorage.setItem(LOCAL_SESSION_KEY, payload);
  } else {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
}

function clearLocalSession() {
  sessionStorage.removeItem(LOCAL_SESSION_KEY);
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return email.includes("@") ? email : "";
}

function cleanAuthError(error) {
  const message = String(error?.message || "Authentication failed.");
  if (message.includes("Email rate limit exceeded")) return "Too many email attempts. Try again shortly.";
  if (message.includes("Invalid login credentials")) return "Invalid email or password.";
  return message;
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
