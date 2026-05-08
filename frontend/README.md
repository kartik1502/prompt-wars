# Running Wanderlust AI Locally

This project uses React, TypeScript, and ES Modules via an `importmap`. To run it locally, you need a development server that can compile `.tsx` files on the fly and inject the required environment variables. [Vite](https://vitejs.dev/) is highly recommended for this.

## Setup Steps

1. **Ensure all files are saved** in your project directory.
2. **Install dependencies** by running:
   ```bash
   npm install
   ```
3. **Configure your API Key**:
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   API_KEY=your_actual_api_key_here
   ```
   *(The provided `vite.config.ts` will automatically map this to `process.env.API_KEY` so you don't have to change the source code).*
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** to the local URL provided by Vite (usually `http://localhost:5173`).
