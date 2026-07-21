/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Bracket API, e.g. http://localhost:5000/api */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
