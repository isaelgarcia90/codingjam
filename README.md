# 🛠️ MaestroPro — Asistente de Cotización y Formalización para Oficios

> **Proyecto para Mexico Tech Week Coding Jam**  
> **Categoría:** AI for Good (Inclusión Económica, Preparación Laboral y Reducción de la Brecha Digital)  
> **Tecnologías:** Google Gemini Multimodal API (Audio + Visión + Structured Output), React, TypeScript, Tailwind CSS, jsPDF.

---

## 🎯 El Problema Social
Más del **55% de la fuerza laboral en México pertenece a la economía informal** (plomeros, electricistas, albañiles, pintores, herreros). Muchos de ellos:
1. Cotizan "al tanteo", olvidando insumos esenciales y perdiendo ingresos de su propio bolsillo.
2. Sufren desconfianza y regateos abusivos por no contar con presupuestos profesionales desglosados.
3. No utilizan computadoras ni software administrativo complejo; sin embargo, todos utilizan notas de voz y fotografías en WhatsApp como su canal diario de trabajo.

---

## 💡 La Solución: MaestroPro
**MaestroPro** transforma una nota de voz coloquial y una foto del lugar de la obra en una **cotización técnica y formal en segundos**:
* **Comprensión Cultural y Jerga Mexicana:** Identifica términos como *"cople", "CPVC", "llave angular", "centro de carga QOD", "pastillas termomagnéticas", "teflón", "repello"* sin fricción.
* **Precios de Referencia en México (MXN):** Estima costos unitarios realistas basados en ferreterías y tlapalerías locales (Truper, Construrama, Home Depot México).
* **Mano de Obra Justa y Anticipo Seguro:** Calcula jornadas dignas y establece esquemas de anticipo (50% anticipo / 50% entrega) y garantía por escrito (30 a 60 días).
* **Salidas Inmediatas en 1 Clic:**
  * 🟢 **Compartir por WhatsApp:** Envía el resumen cortés directamente al cliente.
  * 📄 **Descargar PDF Formal:** Genera una cotización con membrete, desglose de materiales, diagnóstico técnico y líneas de firma.

---

## 🚀 Inicio Rápido

### 1. Clonar e Instalar Dependencias
```bash
npm install
```

### 2. Configurar la API Key de Gemini
Crea un archivo `.env` en la raíz (o cópialo desde `.env.example`):
```env
VITE_GEMINI_API_KEY=tu_clave_de_google_ai_studio_aqui
```
*(También puedes ingresar o cambiar la clave en cualquier momento desde la app haciendo clic en el icono de engrane ⚙️).*

### 3. Ejecutar Servidor Local
```bash
npm run dev
```
Abre en tu navegador o celular: [http://localhost:5173/](http://localhost:5173/)

---

## 📱 Demostración Rápida (1-Click Presets)
Para el pitch del jurado, la app cuenta con dos botones de demo precargados en la pantalla principal:
* 🚰 **Caso 1: Fuga de lavabo (Plomería)** — Demuestra detección de corrosión en cobre, cambio a CPVC y llaves angulares.
* ⚡ **Caso 2: Centro de carga (Electricidad)** — Demuestra modernización de fusibles antiguos a interruptores termomagnéticos Square D.

