Descripción del proyecto:
MENTALIA es una plataforma web creada para brindar apoyo emocional a los estudiantes del SENA mediante un chatbot psicológico con análisis emocional, detección de frases de riesgo, diario emocional, recursos de bienestar y un panel administrativo para la psicóloga institucional.
El sistema incluye módulos para usuarios anónimos, usuarios autenticados y para la psicóloga, así como manejo de alertas críticas, estadísticas y análisis de emociones.

Tecnologías utilizadas
Frontend:
Next.js
React
TailwindCSS

Backend:
Node.js
Express
JWT (autenticación)
Bcrypt (seguridad)

Base de datos:
MongoDB Atlas
Servicios externos
Brevo SMTP

Instrucciones de instalación
Backend
cd backend
npm install
npm run dev
Requiere archivo .env configurado con: MONGO_URI,JWT_SECRET,SMTP (Brevo)

Frontend
cd frontend
npm install
npm run dev
Requiere archivo .env.local con:NEXT_PUBLIC_API_URL=http://localhost:4000

Versión del proyecto
v1.0 – Primera versión estable

Integrantes
Chaireth Benavidez Yañes
Lucía Balaguera Cristancho
