// ====== Referencias del DOM ======
const chatBox = document.getElementById('chatBox');
const emergencyBox = document.getElementById('emergencyBox');

// ====== Config WhatsApp ======
const WHATSAPP_NUMBER = '573114140899'; // sin '+'

function enviarWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
  window.open(url, '_blank'); // abre en nueva pestaña
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

// ====== Respuestas genéricas (terapéuticas, fallback) ======
const respuestasGenericas = [
  'Gracias por compartirlo. Tomarte el tiempo para ponerlo en palabras ya es un paso importante. ¿Qué parte te pesa más ahora mismo?',
  'Estoy aquí contigo. Lo que sientes es válido, y podemos explorarlo con calma. ¿Qué ha pasado hoy que activó estas emociones?',
  'Te escucho. Si te parece, comencemos por lo más urgente o lo más difícil de decir. ¿Qué te ayudaría en este momento?',
  'Notar lo que sientes es valiente. Respiremos juntos: inhala 4, sostén 4, exhala 6. ¿Qué cambia en tu cuerpo al hacerlo?',
  'Agradezco tu confianza. Podemos ordenar esto paso a paso. ¿Qué apoyo has tenido antes que te haya servido?',
  'No estás solo/a en esto. Podemos identificar una acción pequeña y concreta para hoy. ¿Cuál te haría sentir 1% mejor?',
  'Lo que atraviesas tiene sentido con tu historia. Pongamos límites amables a la autoexigencia. ¿Qué necesitas ahora mismo?'
];

// ====== Grupos de respuestas con enfoque clínico ======
// Tristeza
const respuestasTriste = [
  'Siento la tristeza que estás describiendo. Tiene sentido que duela. ¿Dónde la sientes en el cuerpo ahora mismo?',
  'Gracias por ponerle nombre a esa tristeza. ¿Qué la ha intensificado últimamente y qué suele aliviarla aunque sea un poco?',
  'Estar triste no significa estar roto/a; es una señal. ¿Qué necesitarías de ti o de alguien cercano hoy para sentirte acompañado/a?'
];

// “Rendirse”
const respuestasRendir = [
  'Esa sensación de rendirse suele aparecer cuando has sostenido mucho por tiempo prolongado. ¿Qué presión podríamos bajar hoy?',
  'No es fracaso: es cansancio. Probemos una pausa breve y consciente (2 minutos de respiración). ¿Te acompaño a hacerlo?',
  'Mereces descansar sin culpas. Pensemos en una meta mínima y alcanzable para hoy. ¿Cuál podría ser?'
];

// “No puedo más”
const respuestasNoPuedoMas = [
  'Cuando sientes que no puedes más, el sistema nervioso está saturado. Hagamos “5-4-3-2-1” (mira 5 cosas, toca 4, oye 3, huele 2, saborea 1). ¿Qué notas?',
  'Tiene sentido que se sienta abrumador. Pongamos nombre a una sola preocupación y miremosla juntas/os. ¿Cuál eliges?',
  'Estás haciendo lo mejor que puedes con lo que tienes. ¿Qué apoyo práctico o emocional te ayudaría en la próxima hora?'
];

// Soledad
const respuestasSoledad = [
  'La soledad duele porque estamos hechos para vincularnos. ¿Hay alguien seguro a quien escribir un mensaje breve ahora?',
  'Aislarse a veces protege, pero también aísla del alivio. ¿Te gustaría planear un microencuentro (10 min) con alguien de confianza?',
  'Podemos ensayar juntos un mensaje simple para pedir compañía. ¿Te muestro un ejemplo?'
];

// Depresión
const respuestasDepresion = [
  'La depresión no define tu valor. Notar tus ritmos y cuidar tu energía es terapia también. ¿Qué actividad suave (ducha, caminar 5 min) es viable hoy?',
  'Validemos tu ritmo: pequeño, constante y amable. ¿Qué señal temprana notas cuando el ánimo baja y qué podrías hacer en ese momento?',
  'Busquemos anclajes: sueño más regular, hidratación, luz natural. ¿Cuál de estos es más accesible hoy para ti?'
];

// Ansiedad
const respuestasAnsiedad = [
  'La ansiedad suele sobredimensionar el peligro. Probemos respiración 4-4-6 tres veces; dime si baja 1 punto de 0 a 10.',
  'Pongamos la preocupación por escrito: ¿cuál es la predicción? ¿qué evidencia a favor y en contra encuentras?',
  'Si tu cuerpo está en alerta, demos movimiento breve (estira hombros/cuello 60 segundos). ¿Cómo cambia la tensión?'
];

// Miedo
const respuestasMiedo = [
  'El miedo intenta protegerte. Acerquémonos con curiosidad: ¿qué intenta advertirte y qué parte sí puedes controlar hoy?',
  'Nombrarlo ya lo regula. ¿Qué recursos personales has usado antes cuando apareció un miedo similar?',
  'Pauta de seguridad: decide un paso pequeño y reversible. ¿Cuál sería un “primer paso seguro”?'
];

// Cansancio
const respuestasCansancio = [
  'Tu cuerpo te está pidiendo pausa. El descanso no se gana, se necesita. ¿Qué microdescanso (5-10 min) puedes hacer ahora?',
  'Señal de sobrecarga detectada. Probemos “descanso activo”: respirar, hidratar y mover piernas 2 minutos. ¿Lo intentamos?',
  'Permítete bajar el estándar hoy. ¿Qué puedes quitar o delegar para recuperar energía?'
];

// Fracaso
const respuestasFracaso = [
  'Fracasar es parte del aprendizaje, no una identidad. ¿Qué aprendizaje específico rescatas de esto?',
  'Separar resultado de valor personal ayuda: hiciste lo que pudiste con lo que sabías. ¿Qué harías distinto con la info de hoy?',
  'Practiquemos autocompasión: háblate como le hablarías a un buen amigo en la misma situación. ¿Qué le dirías?'
];

// Enojo
const respuestasEnojo = [
  'El enojo señala un límite. Expresemos sin agresión: “cuando pasa X, me siento Y y necesito Z”. ¿Quieres practicarlo?',
  'Valido tu enojo; cuidemos el canal. Descarga física breve (apretar toalla, 30 seg) y luego palabras claras. ¿Te acompaño?',
  '¿Qué valor se ve vulnerado (respeto, justicia, tiempo)? Nombrarlo orienta la acción saludable.'
];

// Familia / conflictos
const respuestasFamilia = [
  'Los conflictos familiares tocan fibras profundas. ¿Qué límite sano te gustaría poner y cómo podríamos comunicarlo?',
  'Puedes cuidar el vínculo y cuidarte a ti. Ensayemos una frase breve y respetuosa para esa conversación difícil.',
  'Diferenciemos el problema de las personas. ¿Cuál es la necesidad no cubierta que podrías expresar?'
];

// Desesperanza / “no tengo salida”
const respuestasNoTengoSalida = [
  'Que parezca sin salida no significa que no la haya. Busquemos dos opciones imperfectas pero posibles.',
  'Cuando la mente dice “nada sirve”, suele estar agotada. Hagamos un mapa de alternativas: ¿qué sería el 1% de mejora?',
  'Miremos el horizonte cercano: solo hoy. ¿Qué acción mínima te mantiene a salvo y contenido/a?'
];

// Vacío
const respuestasVacio = [
  'Esa sensación de vacío puede ser un adormecimiento protector. ¿Qué pequeña experiencia con sentido podrías probar hoy (música, luz, contacto)?',
  'Devolvamos textura al día: algo para el cuerpo, algo para la mente y algo para el vínculo. ¿Qué elegirías?',
  'No tienes que llenarlo todo ahora. Empecemos por notar sin juicios lo que aparece en ti.'
];

// Sin sentido
const respuestasSinSentido = [
  'Cuando la vida parece sin sentido, conviene abreviar el zoom temporal: miremos solo este día. ¿Qué gesto amable contigo puedes hacer hoy?',
  'Conectar con valores reenciende sentido. ¿Qué valor quisieras honrar en una acción pequeña (cuidado, honestidad, servicio)?',
  'Preguntarte por el sentido ya es un movimiento vital. Podemos explorar lo que te importa sin prisa.'
];

// Autoestima negativa / autocríticas
const respuestasSoyUnAsco = [
  'Esa voz crítica suena fuerte, pero no es la verdad completa. ¿Qué evidencia suave tienes a tu favor hoy?',
  'Hablemos con esa voz como si fuera un visitante: “te escucho, pero no decides por mí”. ¿Qué te dice la parte compasiva?',
  'Tu valor no depende de un momento difícil. ¿Qué cualidad tuya ha estado presente incluso en días duros?'
];

const respuestasNoSirvo = [
  'Sentirte “inútil” duele. Distingamos habilidad de valor: puedes aprender sin que tu valor cambie. ¿Qué microhabilidad practicar hoy?',
  '¿Recuerdas una situación donde sí fuiste de ayuda? Rescata 1 acción replicable.',
  'Transformemos el juicio en objetivo: ¿qué te gustaría mejorar y cuál sería el primer paso concreto?'
];

const respuestasNoValgo = [
  'Tu valor es inherente; no depende del rendimiento. ¿Qué gesto de autocuidado harías si creyeras eso por 10 minutos?',
  'Observa cómo te hablas. Probemos una frase compasiva breve y realista. ¿Cuál te resuena?',
  'Valorar no es inflar: es reconocer lo que ya hay. ¿Qué pequeño logro pasó inadvertido hoy?'
];

const respuestasSoyCarga = [
  'Sentirte carga es muy doloroso; suele aparecer con cansancio y culpa. ¿Qué evidencia contradice un poco esa idea?',
  'Pedir ayuda no te hace carga; nos humaniza. ¿A quién podrías pedirle algo concreto y pequeño?',
  'Distribuyamos peso: ¿qué tareas puedes posponer, delegar o simplificar esta semana?'
];

// Violencia sexual (enfoque trauma-informado)
const respuestasViolenciaSexual = [
  'Lamento profundamente que hayas vivido eso. No es tu culpa. Podemos priorizar tu seguridad ahora. ¿Estás en un lugar seguro?',
  'Gracias por confiar algo tan difícil. Puedes elegir qué y cuánto contar. ¿Te gustaría que pensemos en a quién acudir de forma segura?',
  'Cuidar tu cuerpo y tu mente es prioridad. Considera atención médica y acompañamiento especializado cuando te sientas lista/o. Puedo ayudarte a planear ese paso.'
];

// ====== Diccionario de palabras clave ======
const palabrasClave = {
  // Emociones negativas
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

  // Familia y cercanos
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

  // Desesperanza
  'no tengo salida': respuestasNoTengoSalida,
  'quiero desaparecer': 'alerta',
  'me siento vacio': respuestasVacio,
  'me siento vacío': respuestasVacio,
  'sin sentido': respuestasSinSentido,

  // Autoestima negativa
  'soy un asco': respuestasSoyUnAsco,
  'no sirvo para nada': respuestasNoSirvo,
  'no valgo nada': respuestasNoValgo,
  'soy una carga': respuestasSoyCarga,

  // Violencia sexual
  'violacion': respuestasViolenciaSexual,
  'violación': respuestasViolenciaSexual,
  'me violaron': respuestasViolenciaSexual,
  'fui violado': respuestasViolenciaSexual,
  'fui violada': respuestasViolenciaSexual,
  'abuso sexual': respuestasViolenciaSexual,
  'abuso': respuestasViolenciaSexual,

  // ALERTAS directas (riesgo)
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

  // Buscar coincidencias
  for (const clave in palabrasClave) {
    const claveNorm = normalizarTexto(clave);
    if (texto.includes(claveNorm)) {
      const respuesta = palabrasClave[clave];

      if (respuesta === 'alerta') {
        // Mensaje breve y redirección inmediata a WhatsApp
        appendMessage('Bot', 'Detecto riesgo. Priorizamos tu seguridad ahora y abrimos un canal de ayuda inmediata.');
        const msgWA = `Hola, necesito apoyo ahora mismo. Esto fue lo que escribí: "${textoOriginal}". ¿Podemos hablar?`;
        enviarWhatsApp(msgWA); // nueva pestaña

        // (Opcional) muestra caja de emergencia si existe
        if (emergencyBox) emergencyBox.style.display = 'block';
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

  // Fallback terapéutico
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

// ====== Cargar historial e iniciar con saludo ======
window.onload = () => {
  const historial = localStorage.getItem('chatHistory');
  if (historial) {
    chatBox.innerHTML = historial;
  } else {
    appendMessage('Bot', 'Hola 👋 Estoy aquí para acompañarte con respeto y cuidado. ¿Cómo estás hoy, de 0 a 10?');
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
