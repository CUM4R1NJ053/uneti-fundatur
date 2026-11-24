// Helper URLs Google Drive

export class DriveHelper {
  // Extracción de ID
  static extractId(url) {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    if (/^[a-zA-Z0-9_-]{25,}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

    // Docs, Slides y Sheets
    const docsMatch = cleanUrl.match(/\/(?:document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch && docsMatch[1]) return docsMatch[1];

    const queryIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (queryIdMatch && queryIdMatch[1]) return queryIdMatch[1];

    const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) return folderMatch[1];

    return null;
  }

  // URL embed iframe
  static getEmbedUrl(url, type = 'drive') {
    const fileId = this.extractId(url);
    if (!fileId) return url;

    // Docs nativos
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

    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // URL descarga directa
  static getDownloadUrl(url) {
    const fileId = this.extractId(url);
    if (!fileId) return url;

    // Exportación PDF
    if (url.includes('docs.google.com/presentation')) {
      return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
    }
    if (url.includes('docs.google.com/document')) {
      return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
    }

    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // URL vista web
  static getViewUrl(url) {
    const fileId = this.extractId(url);
    if (!fileId) return url;
    
    if (url.includes('/folders/')) {
      return `https://drive.google.com/drive/folders/${fileId}`;
    }
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  // URL miniatura
  static getThumbnailUrl(url, width = 800) {
    const fileId = this.extractId(url);
    if (!fileId) return '';
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
  }

  // Validación formato Drive
  static isValidDriveUrl(url) {
    return Boolean(this.extractId(url));
  }
}
