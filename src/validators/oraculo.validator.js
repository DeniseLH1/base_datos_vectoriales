import { body, validationResult } from "express-validator";

function validarResultado(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  return next();
}

export const validarParFineTuning = [
  body("dominio").trim().notEmpty().withMessage("El dominio es obligatorio."),
  body("preguntaUsuario").trim().notEmpty().withMessage("La pregunta del usuario es obligatoria."),
  body("respuestaAgente").trim().notEmpty().withMessage("La respuesta del agente es obligatoria."),
  validarResultado,
];

export const validarDocumento = [
  body("titulo").trim().notEmpty().withMessage("El título es obligatorio."),
  body("contenido").trim().notEmpty().withMessage("El contenido es obligatorio."),
  body("categoria").optional().trim().isLength({ min: 1 }).withMessage("La categoría no puede estar vacía."),
  validarResultado,
];

export const validarConsultaRAG = [
  body("pregunta").trim().notEmpty().withMessage("La pregunta es obligatoria."),
  body("topK").optional().isInt({ min: 1, max: 5 }).withMessage("topK debe ser un entero entre 1 y 5."),
  body("useReranker").optional().isBoolean().withMessage("useReranker debe ser un booleano."),
  validarResultado,
];
