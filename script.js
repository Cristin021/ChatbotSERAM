const chatBox = document.getElementById('chatBox');
const emergencyBox = document.getElementById('emergencyBox');

const respuestas = {
  triste: 'Siento que te sientes triste. ¿Quieres contarme qué ha pasado?',
  rendirme: 'No te rindas, lo estás haciendo mejor de lo que crees.',
  "no puedo más": 'Es normal sentirse así a veces. Estoy contigo.',
  solo: 'No estás solo/a, aquí estoy para escucharte.',
  suicidio: 'alerta',
  matarme: 'alerta',
  "me quiero morir": 'alerta'
};

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim().toLowerCase();
  if (!text) return;
  appendMessage('Usuario', text);
  input.value = '';
  localStorage.setItem('chatHistory', chatBox.innerHTML);

  for (const palabra in respuestas) {
    if (text.includes(palabra)) {
      if (respuestas[palabra] === 'alerta') {
        emergencyBox.style.display = 'block';
        appendMessage('Chatbot', 'Estoy preocupado por ti. Es importante que hables con alguien de confianza.');
        return;
      } else {
        appendMessage('Chatbot', respuestas[palabra]);
        return;
      }
    }
  }

  appendMessage('Chatbot', 'Gracias por compartir conmigo. Estoy aquí para apoyarte.');
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message');
  if (sender === 'Usuario') msg.classList.add('user');
  msg.innerText = `${sender}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  localStorage.setItem('chatHistory', chatBox.innerHTML);
}

function guardarEstado() {
  const texto = document.getElementById('estadoDiario').value;
  if (texto) {
    const fecha = new Date().toLocaleDateString();
    localStorage.setItem(`estado-${fecha}`, texto);
    alert('Estado emocional guardado para hoy.');
  }
}

// Cargar historial
window.onload = () => {
  const history = localStorage.getItem('chatHistory');
  if (history) chatBox.innerHTML = history;
};
