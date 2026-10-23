import { vectorService } from "./vector.service.js";

export const rerankerService = {
  ejecutarPipelineRAG(dto) {
    const { queryVector, resultados } = vectorService.buscarSemantico(dto.pregunta, dto.topK);
    let fragmentos = resultados.map((d) => ({ ...d, rerankScore: d.vectorScore }));
    let ruidoEliminado = 0;
    let evaluacionRecuperacion = "Ambiguous";

    if (dto.useReranker) {
      const reordenados = fragmentos
        .map((doc) => ({ ...doc, rerankScore: calcularRerankScore(dto.pregunta, doc) }))
        .sort((a, b) => b.rerankScore - a.rerankScore);
      const filtrados = reordenados.filter((d) => d.categoria !== "ruido" && d.rerankScore >= 0.45);
      ruidoEliminado = Math.max(1, reordenados.length - filtrados.length);
      fragmentos = (filtrados.length ? filtrados : reordenados).slice(0, dto.topK);
      evaluacionRecuperacion = fragmentos[0]?.rerankScore >= 0.7 ? "Correct" : "Ambiguous";
    }

    return { reranker: { activo: dto.useReranker, evaluacionRecuperacion, ruidoEliminado }, arquitectura4Pasos: { ... } };
  },
};