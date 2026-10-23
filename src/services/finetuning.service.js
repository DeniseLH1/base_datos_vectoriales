export function prepararFineTuning(dto) {
  const dominio = dto.dominio || "general";
  const tono = dto.tono || "profesional y pedagógico";
  const pregunta = dto.preguntaUsuario || "¿Cómo puedo mejorar esta tarea?";
  const respuesta = dto.respuestaAgente || `Respuesta experta orientada a ${dominio} con un tono ${tono}.`;

  const prompt = `Contexto: ${dominio}\nTono: ${tono}\nPregunta: ${pregunta}`;

  return {
    id: `sft-${Date.now()}`,
    dominio,
    tono,
    prompt,
    respuestaEsperada: respuesta,
    dataset: [
      {
        input: prompt,
        output: respuesta,
      },
    ],
    metadata: {
      estrategia: "SFT",
      numeroEjemplos: 1,
      calidad: "lista para entrenamiento",
    },
  };
}

export default { prepararFineTuning };
