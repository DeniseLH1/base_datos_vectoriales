# API Oráculo

API RESTful en Node.js + Express para experimentar con:
- Fine-tuning SFT
- Base de datos vectorial semántica
- RAG (retrieval + generación)
- Reranker para priorizar documentos relevantes

## Requisitos
- Node.js 18 o superior
- npm

## Instalación
```bash
npm install
```

## Inicializar la API
```bash
npm start
```

La API quedará disponible en http://localhost:3000

## Endpoints principales
- POST /api/oraculo/finetuning/preparar
- GET /api/oraculo/rag/documentos
- POST /api/oraculo/rag/documentos
- POST /api/oraculo/rag/consultar
- GET /api/oraculo/comparar
- GET /health

## Ejemplo de consulta RAG
```bash
curl -X POST http://localhost:3000/api/oraculo/rag/consultar \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"¿Cómo funciona la búsqueda semántica?","topK":3,"useReranker":true}'
```
