const chatBox = document.getElementById('chatBox');
const emergencyBox = document.getElementById('emergencyBox');

const respuestas = [
  {
    palabras: ['triste', 'me siento triste', 'estoy triste'],
    respuesta: 'Siento que te sientes triste. ¿Quieres contarme qué ha pasado?'
  },
  {
    palabras: ['rendir', 'me rindo', 'quiero rendirme'],
    respuesta: 'No te rindas, lo estás haciendo mejor de lo que crees.'
  },
  {
    palabras: ['no puedo más', 'agotado', 'cansado'],
    respuesta: 'Es normal sentirse así a veces. Estoy contigo.'
  },
  {
    palabras: ['solo', 'sola', 'me siento solo', 'me siento sola'],
    respuesta: 'No estás solo/a, aquí estoy para escucharte.'
  },
  {
    palabras: ['depresión', 'tengo depresión', 'estoy deprimido', 'estoy deprimida'],
    respuesta: 'Gracias por confiarme cómo te sientes. Recuerda que hay ayuda disponible y tú vales mucho.'
  },
  {
    palabras: ['suicidio', 'matarme', 'me quiero morir'],
    alerta: true
  }
];

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim().toLowerCase();
  if (!text) return;
  appendMessage('Usuario', text);
  input.value = '';
  localStorage.setItem('chatHistory', chatBox.innerHTML);

  for (const grupo of respuestas) {
    for (const palabra of grupo.palabras) {
      if (text.includes(palabra)) {
        if (grupo.alerta) {
          emergencyBox.style.display = 'block';
          appendMessage('Chatbot', 'Estoy preocupado por ti. Es importante que hables con alguien de confianza.');
          return;
        } else {
          appendMessage('Chatbot', grupo.respuesta);
          return;
        }
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
