// Hook personalizado para validações de arquivo e URL
// Centraliza lógica de validação duplicada entre frontend e backend

import { useCallback } from 'react';
import { ANALYSIS_CONSTANTS } from '@/lib/analysis-utils';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorType?: 'error' | 'warning' | 'info';
}

export function useValidation() {
  // Validação de arquivo (versão simplificada para frontend)
  const validateFile = useCallback((file: File): ValidationResult => {
    const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS, VALID_MIME_TYPES } = ANALYSIS_CONSTANTS;

    // Verifica tamanho
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: "Arquivo muito grande. Máximo 5MB.",
        errorType: 'warning'
      };
    }

    // Verifica se arquivo está vazio
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'Arquivo vazio não é permitido',
        errorType: 'error'
      };
    }

    // Verifica extensão
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return {
        isValid: false,
        error: 'Formato não suportado. Use PNG ou JPG.',
        errorType: 'error'
      };
    }

    // Verifica tipo MIME
    const validMimeTypes = Object.keys(VALID_MIME_TYPES);
    if (!validMimeTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de arquivo não suportado',
        errorType: 'error'
      };
    }

    // Verifica se a extensão corresponde ao tipo MIME
    const expectedExtensions = VALID_MIME_TYPES[file.type as keyof typeof VALID_MIME_TYPES];
    if (!expectedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: 'Extensão do arquivo não corresponde ao tipo de arquivo',
        errorType: 'error'
      };
    }

    return { isValid: true };
  }, []);

  // Validação de URL
  const validateUrl = useCallback((url: string): ValidationResult => {
    try {
      const urlObj = new URL(url);
      
      // Apenas HTTP e HTTPS são permitidos
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          isValid: false,
          error: "Apenas URLs HTTP e HTTPS são permitidas.",
          errorType: 'error'
        };
      }

      // URLs bloqueadas por segurança
      const blockedPatterns = [
        'localhost', '127.0.0.1', '0.0.0.0', '::1', 'file:', 'ftp:', 'data:',
        'javascript:', 'vbscript:', 'mailto:', 'tel:', 'sms:',
        '192.168.', '10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.',
        '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.',
        '172.28.', '172.29.', '172.30.', '172.31.'
      ];
      
      const urlLower = url.toLowerCase();
      if (blockedPatterns.some(pattern => urlLower.includes(pattern))) {
        return {
          isValid: false,
          error: "URL não permitida por motivos de segurança.",
          errorType: 'error'
        };
      }

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: "URL inválida. Verifique o formato.",
        errorType: 'error'
      };
    }
  }, []);

  return {
    validateFile,
    validateUrl
  };
}
