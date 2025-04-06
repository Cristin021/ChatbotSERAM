const chatBox = document.getElementById('chatBox');
const emergencyBox = document.getElementById('emergencyBox');

const palabrasClave = {
  triste: 'Siento que te sientes triste. ¿Quieres contarme qué ha pasado?',
  rendir: 'No te rindas, lo estás haciendo mejor de lo que crees.',
  "no puedo más": 'Es normal sentirse así a veces. Estoy contigo.',
  solo: 'No estás solo/a, aquí estoy para escucharte.',
  depresion: 'Gracias por confiarme cómo te sientes. Recuerda que hay ayuda disponible y tú vales mucho.',
  suicidio: 'alerta',
  matarme: 'alerta',
  "me quiero morir": 'alerta'
};

function sendMessage() {
  const input = document.getElementById('userInput');
  const texto = input.value.trim().toLowerCase();
  if (!texto) return;

  appendMessage('Usuario', texto);
  input.value = '';

  let respuestaEncontrada = false;

  for (const palabra in palabrasClave) {
    if (texto.includes(palabra)) {
      const respuesta = palabrasClave[palabra];
      if (respuesta === 'alerta') {
        emergencyBox.style.display = 'block';
        appendMessage('Bot', 'Estoy preocupado por ti. Es importante que hables con alguien de confianza.');
        respuestaEncontrada = true;
        break;
      } else {
        appendMessage('Bot', respuesta);
        respuestaEncontrada = true;
        break;
      }
    }
  }

  if (!respuestaEncontrada) {
    appendMessage('Bot', 'Gracias por compartir conmigo. Estoy aquí para apoyarte.');
  }

  localStorage.setItem('chatHistory', chatBox.innerHTML);
}

function appendMessage(remitente, mensaje) {
  const div = document.createElement('div');
  div.classList.add('message');

  if (remitente === 'Usuario') {
    div.classList.add('user');
    div.textContent = `${remitente}: ${mensaje}`;
  } else {
    div.innerHTML = `
      <div style="display: flex; align-items: center;">
        <img src="images/bot-avatar.png" alt="Bot" style="width: 40px; height: 40px; margin-right: 10px; border-radius: 50%;">
        <span style="background: #e6eaff; padding: 8px 12px; border-radius: 12px;">${mensaje}</span>
      </div>
    `;
  }

  chatBox.appendChild(div);
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
  const historial = localStorage.getItem('chatHistory');
  if (historial) chatBox.innerHTML = historial;
};

// Enviar con Enter
document.getElementById("userInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
