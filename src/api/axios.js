*** Begin Patch
*** Add File: src/api/axios.js
+import axios from 'axios';
+
+const baseURL = import.meta.env.VITE_API_BASE_URL || '';
+
+const api = axios.create({
+  baseURL,
+});
+
+// Attach Authorization header from localStorage for every request
+api.interceptors.request.use((config) => {
+  const token = localStorage.getItem('token');
+  if (token) {
+    config.headers = config.headers || {};
+    config.headers.Authorization = `Bearer ${token}`;
+  }
+  return config;
+}, (error) => Promise.reject(error));
+
+export default api;
+
*** End Patch
*** Begin Patch
*** Add File: src/contexts/AuthContext.jsx
+import React, { createContext, useState, useEffect } from 'react';
+import api from '../api/axios';
+
+export const AuthContext = createContext({
+  user: null,
+  login: () => {},
+  logout: () => {},
+  setUser: () => {},
+});
+
+export function AuthProvider({ children }) {
+  const [user, setUser] = useState(() => {
+    try {
+      return JSON.parse(localStorage.getItem('user')) || null;
+    } catch {
+      return null;
+    }
+  });
+
+  const login = (token, userObj) => {
+    if (token) localStorage.setItem('token', token);
+    if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
+    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
+    setUser(userObj);
+  };
+
+  const logout = () => {
+    localStorage.removeItem('token');
+    localStorage.removeItem('user');
+    delete api.defaults.headers.common.Authorization;
+    setUser(null);
+  };
+
+  useEffect(() => {
+    const token = localStorage.getItem('token');
+    if (token) {
+      api.defaults.headers.common.Authorization = `Bearer ${token}`;
+    }
+  }, []);
+
+  return (
+    <AuthContext.Provider value={{ user, setUser, login, logout }}>
+      {children}
+    </AuthContext.Provider>
+  );
+}
+
*** End Patch
*** Begin Patch
*** Add File: src/main.jsx
+import React from 'react';
+import { createRoot } from 'react-dom/client';
+import { BrowserRouter } from 'react-router-dom';
+import App from './App';
+import './index.css';
+import { AuthProvider } from './contexts/AuthContext';
+
+createRoot(document.getElementById('root')).render(
+  <React.StrictMode>
+    <BrowserRouter>
+      <AuthProvider>
+        <App />
+      </AuthProvider>
+    </BrowserRouter>
+  </React.StrictMode>
+);
+
*** End Patch
*** Begin Patch
*** Add File: src/pages/Login.jsx
+import { useState, useContext } from 'react';
+import api from '../api/axios';
+import { useNavigate } from 'react-router-dom';
+import { AuthContext } from '../contexts/AuthContext';
+
+export default function Login() {
+  const [email, setEmail] = useState('');
+  const [password, setPassword] = useState('');
+  const [isRegister, setIsRegister] = useState(false);
+  const navigate = useNavigate();
+  const { login } = useContext(AuthContext);
+
+  const handleSubmit = async (e) => {
+    e.preventDefault();
+    const url = isRegister ? '/api/auth/register' : '/api/auth/login';
+    try {
+      const res = await api.post(url, { email, password, name: email.split('@')[0] });
+      if (!isRegister) {
+        // res.data should include token and user
+        login(res.data.token, res.data.user);
+        navigate('/');
+      } else {
+        alert(res.data?.message || 'Conta criada');
+        setIsRegister(false);
+      }
+    } catch (err) {
+      alert(err.response?.data?.error || 'Erro');
+    }
+  };
+
+  return (
+    <div className="flex min-h-screen items-center justify-center">
+      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
+        <h1 className="mb-8 text-center text-4xl font-bold text-green-800">ZapManejo</h1>
+        <form onSubmit={handleSubmit} className="space-y-6">
+          <input
+            type="email"
+            placeholder="seu@email.com"
+            value={email}
+            onChange={(e) => setEmail(e.target.value)}
+            className="w-full rounded-lg border px-5 py-4 text-lg"
+            required
+          />
+          <input
+            type="password"
+            placeholder="Senha"
+            value={password}
+            onChange={(e) => setPassword(e.target.value)}
+            className="w-full rounded-lg border px-5 py-4 text-lg"
+            required
+          />
+          <button className="w-full rounded-lg bg-green-600 py-4 text-xl font-bold text-white hover:bg-green-700">
+            {isRegister ? 'Criar Conta' : 'Entrar'}
+          </button>
+        </form>
+        <p className="mt-6 text-center">
+          {isRegister ? 'Já tem conta?' : 'Novo aqui?'}{' '}
+          <button onClick={() => setIsRegister(!isRegister)} className="text-green-600 font-bold">
+            {isRegister ? 'Faça login' : 'Crie sua conta'}
+          </button>
+        </p>
+      </div>
+    </div>
+  );
+}
+
*** End Patch
*** Begin Patch
*** Add File: src/__tests__/Login.test.jsx
+import React from 'react';
+import { render, screen, fireEvent, waitFor } from '@testing-library/react';
+import { vi } from 'vitest';
+import Login from '../pages/Login';
+import { AuthProvider } from '../contexts/AuthContext';
+import * as apiModule from '../api/axios';
+import { MemoryRouter } from 'react-router-dom';
+
+// Mock navigate from react-router-dom
+vi.mock('react-router-dom', async () => {
+  const actual = await vi.importActual('react-router-dom');
+  return {
+    ...actual,
+    useNavigate: () => vi.fn(),
+  };
+});
+
+describe('Login page', () => {
+  afterEach(() => {
+    localStorage.clear();
+    vi.restoreAllMocks();
+  });
+
+  it('stores token and user in localStorage on successful login', async () => {
+    const fakeResponse = {
+      data: {
+        token: 'fake-jwt-token',
+        user: { id: 1, email: 'test@example.com', name: 'test' },
+      },
+    };
+    vi.spyOn(apiModule.default, 'post').mockResolvedValueOnce(fakeResponse);
+
+    render(
+      <MemoryRouter>
+        <AuthProvider>
+          <Login />
+        </AuthProvider>
+      </MemoryRouter>
+    );
+
+    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), {
+      target: { value: 'test@example.com' },
+    });
+    fireEvent.change(screen.getByPlaceholderText(/Senha/i), {
+      target: { value: 'password123' },
+    });
+
+    fireEvent.click(screen.getByRole('button', { name: /Entrar|Criar Conta/i }));
+
+    await waitFor(() => {
+      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
+      const storedUser = JSON.parse(localStorage.getItem('user'));
+      expect(storedUser).toEqual({ id: 1, email: 'test@example.com', name: 'test' });
+    });
+  });
+});
+
*** End Patch
*** Begin Patch
*** Update File: package.json
@@
   "private": true,
   "scripts": {
-    "dev": "vite",
-    "build": "vite build",
-    "preview": "vite preview"
+    "dev": "vite",
+    "build": "vite build",
+    "preview": "vite preview",
+    "test": "vitest",
+    "test:ui": "vitest --ui"
   },
   "dependencies": {
     "react": "^18.3.1",
     "react-dom": "^18.3.1",
     "react-router-dom": "^6.26.2",
     "axios": "^1.7.7",
     "tailwindcss": "^3.4.13"
   },
-  "devDependencies": {
-    "@vitejs/plugin-react": "^4.3.1",
-    "vite": "^5.4.8"
+  "devDependencies": {
+    "@vitejs/plugin-react": "^4.3.1",
+    "vite": "^5.4.8",
+    "vitest": "^1.0.0",
+    "@testing-library/react": "^14.0.0",
+    "@testing-library/jest-dom": "^6.0.0",
+    "@testing-library/user-event": "^14.0.0",
+    "msw": "^1.2.0",
+    "jsdom": "^22.1.0"
   }
 }
*** End Patch
*** Begin Patch
*** Add File: .github/workflows/ci.yml
+name: CI
+
+on:
+  push:
+    branches: [ main, 'feat/*', 'feature/*' ]
+  pull_request:
+    branches: [ main ]
+
+jobs:
+  test:
+    runs-on: ubuntu-latest
+    strategy:
+      matrix:
+        node-version: [18.x]
+    steps:
+      - uses: actions/checkout@v4
+      - name: Use Node.js ${{ matrix.node-version }}
+        uses: actions/setup-node@v4
+        with:
+          node-version: ${{ matrix.node-version }}
+      - name: Install
+        run: npm ci
+      - name: Run tests
+        run: npm run test -- --run
+
*** End Patch
