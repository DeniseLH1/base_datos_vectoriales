import test from "node:test";
import assert from "node:assert/strict";

import { vectorService } from "../src/services/vector.service.js";
import { rerankerService } from "../src/services/reranker.service.js";
import { prepararFineTuning } from "../src/services/finetuning.service.js";

test("vectorService.listaDocumentos devuelve documentos semilla", () => {
  const documentos = vectorService.listarDocumentos();
  assert.ok(Array.isArray(documentos));
  assert.ok(documentos.length > 0);
});

test("vectorService.buscarSemantico devuelve resultados ordenados", () => {
  const resultado = vectorService.buscarSemantico("¿Cómo funciona la recuperación semántica?", 3);
  assert.equal(resultado.resultados.length, 3);
  assert.ok(resultado.resultados[0].vectorScore >= -1);
});

test("rerankerService ejecuta una pipeline con reranker", () => {
  const resultado = rerankerService.ejecutarPipelineRAG({
    pregunta: "¿Qué es un reranker?",
    topK: 3,
    useReranker: true,
  });

  assert.ok(resultado.reranker);
  assert.ok(Array.isArray(resultado.resultados));
});

test("prepararFineTuning genera un dataset SFT válido", () => {
  const resultado = prepararFineTuning({
    dominio: "base de datos vectoriales",
    tono: "profesional y pedagógico",
    preguntaUsuario: "¿Qué es un embedding?",
    respuestaAgente: "Es una representación numérica que permite comparar conceptos por similitud.",
  });

  assert.equal(resultado.metadata.estrategia, "SFT");
  assert.ok(Array.isArray(resultado.dataset));
  assert.equal(resultado.dataset[0].input.includes("¿Qué es un embedding?"), true);
});
