<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: light;
  --bg: #f6f8fb;
  --surface: #ffffff;
  --surface-soft: #f1f5f9;
  --text: #1f2937;
  --muted: #64748b;
  --border: #dbe3ec;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --danger: #dc2626;
  --danger-hover: #b91c1c;
  --success: #15803d;
  --warning: #a16207;
  --shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
}

a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  text-decoration: underline;
}

button,
input,
select {
  font: inherit;
}

button {
  border: 0;
  border-radius: 10px;
  padding: 0.75rem 0.95rem;
  cursor: pointer;
  background: var(--primary);
  color: #fff;
  transition: background 0.15s ease, opacity 0.15s ease;
}

button:hover {
  background: var(--primary-hover);
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.85rem 0.95rem;
  background: #fff;
  color: var(--text);
}

input:focus,
select:focus {
  outline: 2px solid rgba(30, 102, 245, 0.22);
  border-color: var(--primary);
}

main {
  width: min(1080px, calc(100% - 32px));
  margin: 24px auto;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

p {
  color: var(--muted);
  line-height: 1.5;
}

form,
.stack {
  display: grid;
  gap: 16px;
}

article {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  box-shadow: none;
}

.toolbar,
.actions,
.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.toolbar {
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-grid {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

.field-error {
  color: var(--danger);
  font-size: 0.92rem;
  margin: 0;
}

.notice-error {
  color: var(--danger);
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px 14px;
  border-radius: 12px;
}

.notice-success {
  color: var(--success);
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 12px 14px;
  border-radius: 12px;
}

.secondary-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  background: var(--surface-soft);
  color: var(--text);
}

.danger-button {
  background: var(--danger);
}

.danger-button:hover {
  background: var(--danger-hover);
}

.ghost-button {
  background: var(--surface-soft);
  color: var(--text);
}

.ghost-button:hover {
  background: #dde6ef;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.status-active {
  color: var(--success);
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.status-inactive {
  color: var(--warning);
  background: #fffbeb;
  border-color: #fde68a;
}

.meta {
  display: grid;
  gap: 6px;
}

.subtle {
  color: var(--muted);
  font-size: 0.95rem;
}

@media (max-width: 720px) {
  main {
    width: min(100% - 16px, 1080px);
    margin: 8px auto;
    padding: 16px;
    border-radius: 12px;
  }

  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
