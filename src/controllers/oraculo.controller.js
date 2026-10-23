import { ParFineTuningDTO, CrearDocumentoDTO, ConsultaRAGDTO } from "../dtos/oraculo.dto.js";
import { prepararFineTuning as prepararDatasetSFT } from "../services/finetuning.service.js";
import { vectorService } from "../services/vector.service.js";
import { rerankerService } from "../services/reranker.service.js";

export function prepararFineTuning(req, res, next) {
  try {
    const dto = new ParFineTuningDTO(req.body);
    const dataset = prepararDatasetSFT(dto);
    return res.status(201).json({ ok: true, data: dataset });
  } catch (error) {
    return next(error);
  }
}

export function listarDocumentos(_req, res, next) {
  try {
    return res.json({ ok: true, data: vectorService.listarDocumentos() });
  } catch (error) {
    return next(error);
  }
}

export function indexarDocumento(req, res, next) {
  try {
    const dto = new CrearDocumentoDTO(req.body);
    const documento = vectorService.indexarDocumento(dto);
    return res.status(201).json({ ok: true, data: documento });
  } catch (error) {
    return next(error);
  }
}

export function consultarRAG(req, res, next) {
  try {
    const dto = new ConsultaRAGDTO(req.body);
    const resultado = rerankerService.ejecutarPipelineRAG(dto);
    return res.json({ ok: true, data: resultado });
  } catch (error) {
    return next(error);
  }
}

export function compararEnfoques(req, res, next) {
  try {
    const pregunta = String(req.query.pregunta ?? "¿Cómo funciona la recuperación semántica?");
    const topK = Number(req.query.topK ?? 3);
    const dto = new ConsultaRAGDTO({
      pregunta,
      topK,
      useReranker: req.query.useReranker !== "false",
    });

    const sinReranker = vectorService.buscarSemantico(pregunta, topK);
    const conReranker = rerankerService.ejecutarPipelineRAG(dto);

    return res.json({
      ok: true,
      data: {
        pregunta,
        topK,
        comparacion: {
          sinReranker: {
            resultados: sinReranker.resultados.map((doc) => ({
              id: doc.id,
              titulo: doc.titulo,
              categoria: doc.categoria,
              vectorScore: doc.vectorScore,
            })),
          },
          conReranker: conReranker,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}
