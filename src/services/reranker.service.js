import { vectorService } from "./vector.service.js";

export function calcularRerankScore(pregunta, documento) {
  const texto = `${documento.titulo} ${documento.contenido}`.toLowerCase();
  const queryTokens = new Set((pregunta.toLowerCase().match(/[a-záéíóúüñ]+/g) ?? []).filter(Boolean));
  const docTokens = (texto.match(/[a-záéíóúüñ]+/g) ?? []).filter(Boolean);

  let coincidencias = 0;
  for (const token of queryTokens) {
    if (docTokens.includes(token)) {
      coincidencias += 1;
    }
  }

  const lexicalOverlap = coincidencias / Math.max(queryTokens.size, 1);
  const semanticScore = Number(documento.vectorScore ?? 0);

  return Number(Math.min(1, (0.55 * semanticScore + 0.45 * lexicalOverlap)).toFixed(4));
}

export const rerankerService = {
  ejecutarPipelineRAG(dto) {
    const topK = Math.max(1, Number(dto.topK ?? 3));
    const { queryVector, resultados } = vectorService.buscarSemantico(dto.pregunta, topK);
    let fragmentos = resultados.map((documento) => ({
      ...documento,
      rerankScore: documento.vectorScore ?? 0,
    }));

    if (dto.useReranker) {
      const reordenados = fragmentos
        .map((documento) => ({
          ...documento,
          rerankScore: calcularRerankScore(dto.pregunta, documento),
        }))
        .sort((a, b) => b.rerankScore - a.rerankScore);

      const filtrados = reordenados.filter((documento) => documento.categoria !== "ruido" && documento.rerankScore >= 0.45);
      const ruidoEliminado = Math.max(0, reordenados.length - filtrados.length);

      fragmentos = (filtrados.length ? filtrados : reordenados).slice(0, topK);
      const evaluacionRecuperacion = fragmentos[0]?.rerankScore >= 0.7 ? "Correct" : "Ambiguous";

      return {
        queryVector,
        resultados: fragmentos.map((documento) => ({
          id: documento.id,
          titulo: documento.titulo,
          categoria: documento.categoria,
          vectorScore: documento.vectorScore,
          rerankScore: documento.rerankScore,
        })),
        reranker: {
          activo: true,
          evaluacionRecuperacion,
          ruidoEliminado,
        },
        arquitectura4Pasos: {
          recuperacion: "embedding_similarity",
          reranking: "reordenamiento_semantico",
          filtrado: "eliminar_ruido",
          respuesta: "respuesta_generada_con_contexto_calificado",
        },
      };
    }

    return {
      queryVector,
      resultados: fragmentos.slice(0, topK).map((documento) => ({
        id: documento.id,
        titulo: documento.titulo,
        categoria: documento.categoria,
        vectorScore: documento.vectorScore,
        rerankScore: documento.rerankScore,
      })),
      reranker: {
        activo: false,
        evaluacionRecuperacion: "No rerank",
        ruidoEliminado: 0,
      },
      arquitectura4Pasos: {
        recuperacion: "embedding_similarity",
        reranking: "disabled",
        filtrado: "sin_filtrado",
        respuesta: "respuesta_generada_con_contexto_basico",
      },
    };
  },
};