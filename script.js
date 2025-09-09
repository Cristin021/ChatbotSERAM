// ====== Referencias del DOM ======
const chatBox = document.getElementById('chatBox');
const emergencyBox = document.getElementById('emergencyBox');

// ====== Config WhatsApp ======
const WHATSAPP_NUMBER = '573114140899'; // sin '+'

function enviarWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
  window.location.href = url; // redirige directo en la misma pestaña
}

// ====== Utilidades ======
function normalizarTexto(s) {
  return (s || "")
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ====== Respuestas genéricas (fallback) ======
const respuestasGenericas = [
  'Gracias por compartir conmigo. Estoy aquí para apoyarte.',
  'Entiendo lo que dices, y quiero que sepas que no estás solo/a.',
  'Lo que sientes es válido, gracias por expresarlo.',
  'Estoy aquí para escucharte y acompañarte.',
  'Tus palabras son importantes, gracias por confiar en mí.',
  'No estás solo/a en esto, puedes contar conmigo.',
  'Sé que no es fácil hablar de lo que sientes, valoro mucho que lo hagas.',
  'Gracias por abrirte. Estoy contigo en esto.',
  'Aprecio que lo compartas; podemos atravesarlo paso a paso.'
];

// ====== Grupos de respuestas ======
const respuestasTriste = [
  'Siento que te sientes triste. ¿Quieres contarme qué ha pasado?',
  'A veces sentirse triste es normal, ¿quieres hablar más de eso?',
  'Entiendo tu tristeza, recuerda que no estás solo/a.'
];
const respuestasRendir = [
  'No te rindas, lo estás haciendo mejor de lo que crees.',
  'A veces parece difícil, pero cada paso que das cuenta.',
  'No olvides que eres más fuerte de lo que piensas.'
];
const respuestasNoPuedoMas = [
  'Es normal sentirse así a veces. Estoy contigo.',
  'Respira, tómate un momento. No estás solo/a.',
  'A veces la carga se siente pesada, pero no estás sin apoyo.'
];
const respuestasSoledad = [
  'No estás solo/a, aquí estoy para escucharte.',
  'Recuerda que siempre hay alguien dispuesto a apoyarte.',
  'Aunque sientas soledad, no estás abandonado/a.'
];
const respuestasDepresion = [
  'Gracias por confiarme cómo te sientes. Recuerda que hay ayuda disponible y tú vales mucho.',
  'La depresión no define tu valor, eres importante.',
  'Hablar de lo que sientes es un paso valiente, gracias por compartirlo.'
];
const respuestasAnsiedad = [
  'Respira profundo, a veces la ansiedad nos engaña haciéndonos sentir en peligro cuando no lo estamos.',
  'Entiendo tu ansiedad, ¿quieres que pensemos juntos en algo que pueda tranquilizarte?',
  'Estás haciendo lo mejor que puedes, y eso ya es suficiente.'
];
const respuestasMiedo = [
  'El miedo es una emoción válida, pero no te controla. Estoy contigo.',
  'No estás solo/a enfrentando ese miedo.',
  'Es valiente reconocer cuando algo nos asusta.'
];
const respuestasCansancio = [
  'Descansar también es importante, mereces una pausa.',
  'Estás haciendo mucho, y es normal sentirse cansado/a.',
  'Tu bienestar importa, escucha a tu cuerpo y tu mente.'
];
const respuestasFracaso = [
  'El fracaso no te define, es solo una oportunidad de aprendizaje.',
  'Todos fallamos en algún momento, y eso nos ayuda a crecer.',
  'Un tropiezo no borra todo tu esfuerzo ni tu valor.'
];
const respuestasEnojo = [
  'Está bien sentir enojo, es una emoción válida.',
  'A veces expresarlo de forma sana ayuda a liberar esa tensión.',
  'Gracias por compartir lo que sientes, incluso el enojo merece ser escuchado.'
];
const respuestasFamilia = [
  'Las discusiones en la familia pueden doler mucho, entiendo cómo te sientes.',
  'A veces los conflictos con la familia son difíciles, pero hablar de ello ayuda.',
  'La familia es importante, pero también lo eres tú. Tus emociones cuentan.',
  'Aunque tengas problemas con tu familia, no estás solo/a en esto.'
];
const respuestasNoTengoSalida = [
  'Puede sentirse así, pero siempre hay caminos que aún no se ven.',
  'Aunque parezca oscuro, no estás solo/a en esto.',
  'Las soluciones a veces tardan, pero existen.'
];
const respuestasVacio = [
  'Esa sensación puede ser muy dura, pero hablarlo ya es un gran paso.',
  'Aunque sientas vacío, tu vida tiene valor y significado.',
  'No estás solo/a con ese sentimiento, estoy aquí.'
];
const respuestasSinSentido = [
  'A veces la vida parece no tener sentido, pero tu existencia importa.',
  'Tus sentimientos son válidos, y tu valor no depende de lo que sientas en este momento.',
  'Hablemos de lo que sientes, no tienes que cargarlo solo/a.'
];
const respuestasSoyUnAsco = [
  'Entiendo que te sientas así, pero no eres un asco. Tu vida tiene valor.',
  'A veces los pensamientos negativos nos engañan, pero no definen quién eres.',
  'Aunque te sientas así, recuerda que eres importante y valioso/a.'
];
const respuestasNoSirvo = [
  'Ese sentimiento es muy duro, pero no es verdad: todos tenemos valor.',
  'Puedes sentirte inútil a veces, pero tu vida impacta más de lo que crees.',
  'Ese pensamiento no te define: tienes mucho que aportar.'
];
const respuestasNoValgo = [
  'Tú vales mucho más de lo que piensas en este momento.',
  'Aunque sientas que no vales nada, tu existencia importa.',
  'No dejes que ese pensamiento te engañe, tu valor es real.'
];
const respuestasSoyCarga = [
  'Entiendo que te sientas así, pero no eres una carga. Eres importante.',
  'A veces pensamos que molestamos, pero tu vida tiene sentido.',
  'No eres una carga, mereces amor y apoyo.'
];
const respuestasViolenciaSexual = [
  'Lamento mucho que estés pasando por algo tan doloroso. No tienes que enfrentarlo solo/a.',
  'Hablar de una experiencia así es muy difícil, pero es importante que lo compartas con alguien de confianza.',
  'Lo que te pasó no es tu culpa. Contarlo puede ser un primer paso para recibir el apoyo que mereces.'
];

// ====== Diccionario de palabras clave ======
const palabrasClave = {
  'triste': respuestasTriste,
  'rendir': respuestasRendir,
  'no puedo mas': respuestasNoPuedoMas,
  'no puedo más': respuestasNoPuedoMas,
  'solo': respuestasSoledad,
  'soledad': respuestasSoledad,
  'depresion': respuestasDepresion,
  'depresión': respuestasDepresion,
  'ansiedad': respuestasAnsiedad,
  'miedo': respuestasMiedo,
  'cansado': respuestasCansancio,
  'cansada': respuestasCansancio,
  'fracaso': respuestasFracaso,
  'enojo': respuestasEnojo,
  'enojado': respuestasEnojo,
  'enojada': respuestasEnojo,
  'familia': respuestasFamilia,
  'papas': respuestasFamilia,
  'papás': respuestasFamilia,
  'papa': respuestasFamilia,
  'papá': respuestasFamilia,
  'mama': respuestasFamilia,
  'mamá': respuestasFamilia,
  'padres': respuestasFamilia,
  'hermano': respuestasFamilia,
  'hermana': respuestasFamilia,
  'hermanos': respuestasFamilia,
  'no tengo salida': respuestasNoTengoSalida,
  'quiero desaparecer': 'alerta',
  'me siento vacio': respuestasVacio,
  'me siento vacío': respuestasVacio,
  'sin sentido': respuestasSinSentido,
  'soy un asco': respuestasSoyUnAsco,
  'no sirvo para nada': respuestasNoSirvo,
  'no valgo nada': respuestasNoValgo,
  'soy una carga': respuestasSoyCarga,
  'violacion': respuestasViolenciaSexual,
  'violación': respuestasViolenciaSexual,
  'me violaron': respuestasViolenciaSexual,
  'fui violado': respuestasViolenciaSexual,
  'fui violada': respuestasViolenciaSexual,
  'abuso sexual': respuestasViolenciaSexual,
  'abuso': respuestasViolenciaSexual,
  'suicidio': 'alerta',
  'matarme': 'alerta',
  'me quiero morir': 'alerta',
  'quitarme la vida': 'alerta',
  'acabar con todo': 'alerta',
  'terminar conmigo': 'alerta'
};

// ====== Envío de mensaje ======
function sendMessage() {
  const input = document.getElementById('userInput');
  const textoOriginal = input.value.trim();
  if (!textoOriginal) return;

  appendMessage('Usuario', textoOriginal);
  input.value = '';

  const texto = normalizarTexto(textoOriginal);
  let respuestaEncontrada = false;

  for (const clave in palabrasClave) {
    const claveNorm = normalizarTexto(clave);
    if (texto.includes(claveNorm)) {
      const respuesta = palabrasClave[clave];

      if (respuesta === 'alerta') {
        appendMessage('Bot', '¡Alerta detectada! Te estamos redirigiendo a WhatsApp para buscar ayuda inmediata...');
        const msgWA = `Hola, necesito apoyo ahora mismo. Esto fue lo que escribí: "${textoOriginal}". ¿Podemos hablar?`;
        enviarWhatsApp(msgWA); // redirige directo
        respuestaEncontrada = true;
        break;
      } else if (Array.isArray(respuesta)) {
        appendMessage('Bot', pickRandom(respuesta));
        respuestaEncontrada = true;
        break;
      } else if (typeof respuesta === 'string') {
        appendMessage('Bot', respuesta);
        respuestaEncontrada = true;
        break;
      }
    }
  }

  if (!respuestaEncontrada) {
    appendMessage('Bot', pickRandom(respuestasGenericas));
  }

  localStorage.setItem('chatHistory', chatBox.innerHTML);
}

// ====== Render de mensajes ======
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

// ====== Guardar estado diario ======
function guardarEstado() {
  const texto = document.getElementById('estadoDiario')?.value;
  if (texto) {
    const fecha = new Date().toLocaleDateString();
    localStorage.setItem(`estado-${fecha}`, texto);
    alert('Estado emocional guardado para hoy.');
  }
}

// ====== Cargar historial ======
window.onload = () => {
  const historial = localStorage.getItem('chatHistory');
  if (historial) {
    chatBox.innerHTML = historial;
  } else {
    appendMessage('Bot', 'Hola 👋 ¿cómo estás hoy?');
    localStorage.setItem('chatHistory', chatBox.innerHTML);
  }
};

// ====== Enviar con Enter ======
document.getElementById('userInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});
