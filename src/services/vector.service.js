export function similitudCoseno(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return Number((dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1)).toFixed(4));
}

export const vectorService = {
  listarDocumentos() { return DOCUMENTOS_SEMILLA; },
  indexarDocumento(dto) {
    const nuevo = { id: `doc-0${DOCUMENTOS_SEMILLA.length + 1}`, ...dto, vector: generarEmbedding(`${dto.titulo} ${dto.contenido}`) };
    DOCUMENTOS_SEMILLA.unshift(nuevo);
    return nuevo;
  },
  buscarSemantico(pregunta, topK = 4) {
    const queryVector = generarEmbedding(pregunta);
    const resultados = DOCUMENTOS_SEMILLA.map((doc) => ({ ...doc, vectorScore: similitudCoseno(queryVector, doc.vector) }))
      .sort((a, b) => b.vectorScore - a.vectorScore)
      .slice(0, topK + 1);
    return { queryVector, resultados };
  },
};