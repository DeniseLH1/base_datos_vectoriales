import { Router } from "express";
import { prepararFineTuning, listarDocumentos, indexarDocumento, consultarRAG, compararEnfoques } from "../controllers/oraculo.controller.js";
import { validarParFineTuning, validarDocumento, validarConsultaRAG } from "../validators/oraculo.validator.js";

export const oraculoRouter = Router();

oraculoRouter.post("/finetuning/preparar", validarParFineTuning, prepararFineTuning);
oraculoRouter.get("/rag/documentos", listarDocumentos);
oraculoRouter.post("/rag/documentos", validarDocumento, indexarDocumento);
oraculoRouter.post("/rag/consultar", validarConsultaRAG, consultarRAG);
oraculoRouter.get("/comparar", compararEnfoques);