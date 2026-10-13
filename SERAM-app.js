// SERAM · login + base de datos. Se carga DESPUÉS de script.js (no hay que editar script.js).
// Si config.js está vacío funciona en "modo demostración" (datos solo en este navegador).
(() => {
  const cfg = window.SERAM_CONFIG || {};
  const cloud = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  const sb = cloud ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  const $ = id => document.getElementById(id);
  const LS = (k, v) => v === undefined
    ? JSON.parse(localStorage.getItem(k) || 'null')
    : localStorage.setItem(k, JSON.stringify(v));
  let user = null, registrando = false;

  const sha = async s => [...new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))]
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // ---------- Autenticación ----------
  async function entrar(email, pass, nombre) {
    if (cloud) {
      const r = registrando
        ? await sb.auth.signUp({ email, password: pass, options: { data: { nombre } } })
        : await sb.auth.signInWithPassword({ email, password: pass });
      if (r.error) throw r.error;
      if (!r.data.session) throw new Error('Revisa tu correo para confirmar la cuenta y luego inicia sesión.');
      return { id: r.data.user.id, nombre: r.data.user.user_metadata?.nombre || email };
    }
    const users = LS('seram_users') || {};
    const h = await sha(pass);
    if (registrando) {
      if (users[email]) throw new Error('Ese correo ya está registrado.');
      users[email] = { nombre, h };
      LS('seram_users', users);
    } else if (!users[email] || users[email].h !== h) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    LS('seram_session', email);
    return { id: email, nombre: users[email].nombre };
  }

  async function sesionActual() {
    if (cloud) {
      const { data } = await sb.auth.getSession();
      const u = data.session?.user;
      return u ? { id: u.id, nombre: u.user_metadata?.nombre || u.email } : null;
    }
    const e = LS('seram_session'), us = LS('seram_users') || {};
    return e && us[e] ? { id: e, nombre: us[e].nombre } : null;
  }

  async function salir() {
    if (cloud) await sb.auth.signOut(); else localStorage.removeItem('seram_session');
    localStorage.removeItem('chatHistory');
    location.reload();
  }

  // ---------- Datos ----------
  const clave = t => `seram_${t}_${user.id}`;
  window.SERAM = {
    async saveMessage(rol, contenido) {
      if (cloud) return sb.from('mensajes').insert({ user_id: user.id, rol, contenido });
      const l = LS(clave('chat')) || []; l.push({ rol, contenido }); LS(clave('chat'), l);
    },
    async loadMessages() {
      if (cloud) {
        const { data } = await sb.from('mensajes').select('rol,contenido').order('creado', { ascending: true });
        return data || [];
      }
      return LS(clave('chat')) || [];
    },
    async saveMood(texto) {
      if (cloud) return sb.from('estados').insert({ user_id: user.id, texto });
      const l = LS(clave('mood')) || []; l.push({ texto, fecha: new Date().toISOString() }); LS(clave('mood'), l);
    }
  };

  // ---------- Sustituye funciones de script.js ----------
  window.appendMessage = function (remitente, mensaje, guardar = true) {
    const esUser = remitente === 'Usuario';
    const div = document.createElement('div');
    div.className = 'message ' + (esUser ? 'user' : 'bot');
    if (!esUser) {
      const img = document.createElement('img');
      img.src = 'images/bot-avatar.png'; img.alt = 'SERAM';
      div.appendChild(img);
    }
    const b = document.createElement('span');
    b.className = 'bubble'; b.textContent = mensaje;
    div.appendChild(b);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (guardar && user) window.SERAM.saveMessage(esUser ? 'Usuario' : 'Bot', mensaje);
  };

  window.guardarEstado = async function () {
    const t = $('estadoDiario').value.trim();
    if (!t) return;
    await window.SERAM.saveMood(t);
    $('estadoDiario').value = '';
    alert('Estado emocional guardado para hoy.');
  };

  // ---------- Arranque ----------
  async function mostrarApp() {
    $('authScreen').hidden = true;
    $('app').hidden = false;
    $('userName').textContent = 'Hola, ' + user.nombre;
    localStorage.removeItem('chatHistory'); // el historial ahora va por usuario
    chatBox.innerHTML = '';
    const previos = await window.SERAM.loadMessages();
    if (previos.length) previos.forEach(m => window.appendMessage(m.rol, m.contenido, false));
    else window.appendMessage('Bot', 'Hola 👋 Estoy aquí para acompañarte con respeto y cuidado. ¿Cómo estás hoy, de 0 a 10?');
  }

  window.onload = () => {
    $('authMode').textContent = cloud ? '' : 'Modo demostración: los datos se guardan solo en este navegador.';
    $('authToggle').onclick = e => {
      e.preventDefault();
      registrando = !registrando;
      $('authNombre').hidden = !registrando;
      $('authNombre').required = registrando;
      $('authBtn').textContent = registrando ? 'Crear cuenta' : 'Entrar';
      $('authToggle').textContent = registrando ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate';
      $('authPass').autocomplete = registrando ? 'new-password' : 'current-password';
    };
    $('authForm').onsubmit = async e => {
      e.preventDefault();
      $('authError').textContent = '';
      try {
        user = await entrar($('authEmail').value.trim().toLowerCase(), $('authPass').value, $('authNombre').value.trim());
        mostrarApp();
      } catch (err) { $('authError').textContent = err.message; }
    };
    $('logoutBtn').onclick = salir;
    sesionActual().then(u => { if (u) { user = u; mostrarApp(); } });
  };
})();
