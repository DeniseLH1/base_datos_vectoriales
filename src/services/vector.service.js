const VOCABULARIO = [
  "vector",
  "base",
  "datos",
  "documento",
  "consulta",
  "semantico",
  "rag",
  "indice",
  "respuesta",
  "persistencia",
  "embed",
  "modelo",
  "finetuning",
  "reranker",
  "aprendizaje",
  "busqueda",
  "contexto",
  "api",
  "seguridad",
  "usuario",
];

function normalizarTexto(texto = "") {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-záéíóúüñ]+/g) ?? [];
}

export function generarEmbedding(texto = "") {
  const frecuencia = new Map();
  const tokens = normalizarTexto(texto);

  for (const token of tokens) {
    const indice = VOCABULARIO.indexOf(token);
    if (indice >= 0) {
      frecuencia.set(indice, (frecuencia.get(indice) ?? 0) + 1);
      continue;
    }

    const hash = Array.from(token).reduce((sum, char) => sum + char.charCodeAt(0), 0) % VOCABULARIO.length;
    frecuencia.set(hash, (frecuencia.get(hash) ?? 0) + 1);
  }

  return VOCABULARIO.map((_, indice) => frecuencia.get(indice) ?? 0);
}

export const DOCUMENTOS_SEMILLA = [
  {
    id: "doc-01",
    titulo: "Bases de datos vectoriales",
    categoria: "vector-db",
    contenido:
      "Las bases de datos vectoriales almacenan embeddings y recuperan contextos semánticos similares mediante búsqueda por proximidad en espacios multidimensionales.",
    vector: generarEmbedding("bases de datos vectoriales embeddings proximidad semántica contextos multidimensionales"),
  },
  {
    id: "doc-02",
    titulo: "RAG con documentos",
    categoria: "rag",
    contenido:
      "El patrón RAG combina la recuperación de documentos relevantes con la generación de respuestas usando el contexto del usuario como guía.",
    vector: generarEmbedding("rag documentos relevantes contexto generacion respuestas usuario recuperacion"),
  },
  {
    id: "doc-03",
    titulo: "Fine-tuning SFT",
    categoria: "finetuning",
    contenido:
      "El fine-tuning supervisado ajusta un modelo con ejemplos de entrada-salida para mejorar la respuesta del agente en un dominio específico.",
    vector: generarEmbedding("fine tuning sft supervisado modelo ejemplos entrada salida dominio respuesta agente"),
  },
  {
    id: "doc-04",
    titulo: "Reranker para relevancia",
    categoria: "reranker",
    contenido:
      "Un reranker reordena los candidatos recuperados para priorizar los documentos más útiles y reducir la presencia de ruido en la respuesta final.",
    vector: generarEmbedding("reranker reordena candidatos recuperados utilidad ruido respuesta final relevancia"),
  },
];

export function similitudCoseno(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i += 1) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (!denominator) return 0;

  return Number((dot / denominator).toFixed(4));
}

export const vectorService = {
  listarDocumentos() {
    return DOCUMENTOS_SEMILLA;
  },
  indexarDocumento(dto) {
    const nuevo = {
      id: `doc-${String(DOCUMENTOS_SEMILLA.length + 1).padStart(2, "0")}`,
      titulo: dto.titulo,
      categoria: dto.categoria || "general",
      contenido: dto.contenido,
      vector: generarEmbedding(`${dto.titulo} ${dto.contenido}`),
    };

    DOCUMENTOS_SEMILLA.unshift(nuevo);
    return nuevo;
  },
  buscarSemantico(pregunta, topK = 4) {
    const valorTopK = Math.max(1, Number(topK) || 4);
    const queryVector = generarEmbedding(pregunta);
    const resultados = DOCUMENTOS_SEMILLA.map((doc) => ({
      ...doc,
      vectorScore: similitudCoseno(queryVector, doc.vector),
    }))
      .sort((a, b) => b.vectorScore - a.vectorScore)
      .slice(0, valorTopK);

    return { queryVector, resultados };
  },
};