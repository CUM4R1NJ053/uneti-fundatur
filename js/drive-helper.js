/**
 * UNETI - PROYECTO SOCIOECONÓMICO
 * Motor de Integración y Normalización de Enlaces de Google Drive
 */

export class DriveHelper {
  /**
   * Extrae el ID único del archivo o carpeta de Google Drive desde cualquier formato común
   * @param {string} url - Enlace provisto por el usuario
   * @returns {string|null} - ID de Google Drive o null si no se reconoce
   */
  static extractId(url) {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    // 1. Si el usuario ingresó directamente el ID alfanumérico limpio
    if (/^[a-zA-Z0-9_-]{25,}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    // 2. Patrones estándar /file/d/{ID}
    const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

    // 3. Documentos, Presentaciones, Hojas de cálculo de Google Docs
    const docsMatch = cleanUrl.match(/\/(?:document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch && docsMatch[1]) return docsMatch[1];

    // 4. Parámetro query id=... (?id=... o &id=...)
    const queryIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (queryIdMatch && queryIdMatch[1]) return queryIdMatch[1];

    // 5. Carpetas de Google Drive /folders/{ID}
    const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) return folderMatch[1];

    return null;
  }

  /**
   * Genera el enlace de previsualización (Preview Embed) óptimo para iframes
   * @param {string} url - Enlace original
   * @param {string} type - Tipo de recurso (video, pdf, presentation, etc.)
   * @returns {string} - URL lista para incrustar en un <iframe>
   */
  static getEmbedUrl(url, type = 'drive') {
    const fileId = this.extractId(url);
    if (!fileId) return url;

    // Si es Google Docs, Slides o Sheets nativo
    if (url.includes('docs.google.com/presentation')) {
      return `https://docs.google.com/presentation/d/${fileId}/embed?start=false&loop=false&delayms=3000`;
    }
    if (url.includes('docs.google.com/document')) {
      return `https://docs.google.com/document/d/${fileId}/preview`;
    }
    if (url.includes('docs.google.com/spreadsheets')) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/preview?widget=true&headers=false`;
    }
    if (url.includes('/folders/')) {
      return `https://drive.google.com/embeddedfolderview?id=${fileId}#grid`;
    }

    // Para archivos estándar de Google Drive (Videos MP4, PDFs, imágenes, grabaciones)
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  /**
   * Genera el enlace directo para descarga forzada o exportación limpia
   * @param {string} url - Enlace original
   * @returns {string} - URL de descarga directa
   */
  static getDownloadUrl(url) {
    const fileId = this.extractId(url);
    if (!fileId) return url;

    // Si es Google Slides o Docs, podemos exportar como PDF o enlace nativo
    if (url.includes('docs.google.com/presentation')) {
      return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
    }
    if (url.includes('docs.google.com/document')) {
      return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
    }

    // Para archivos alojados en Drive
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  /**
   * Genera el enlace canónico para abrir en Google Drive en una nueva pestaña
   * @param {string} url - Enlace original
   * @returns {string} - URL para visualización en Drive
   */
  static getViewUrl(url) {
    const fileId = this.extractId(url);
    if (!fileId) return url;
    
    if (url.includes('/folders/')) {
      return `https://drive.google.com/drive/folders/${fileId}`;
    }
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  /**
   * Obtiene la URL de miniatura directa de Google Drive
   * @param {string} url - Enlace original
   * @param {number} width - Ancho deseado
   * @returns {string} - URL de miniatura
   */
  static getThumbnailUrl(url, width = 800) {
    const fileId = this.extractId(url);
    if (!fileId) return '';
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
  }

  /**
   * Diagnostica si un enlace es válido de Google Drive
   * @param {string} url 
   * @returns {boolean}
   */
  static isValidDriveUrl(url) {
    return Boolean(this.extractId(url));
  }
}
