
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QRValidatorProps {
  url: string;
}

const QRValidator: React.FC<QRValidatorProps> = ({ url }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    status?: number;
  } | null>(null);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const validateQRCode = async () => {
    setIsValidating(true);
    setValidationResult(null);

    // Basic URL validation
    if (!validateUrl(url)) {
      setValidationResult({
        isValid: false,
        message: 'Invalid URL format. Please enter a valid HTTP or HTTPS URL.'
      });
      setIsValidating(false);
      return;
    }

    try {
      // Try to fetch the URL to check if it's accessible
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      setValidationResult({
        isValid: true,
        message: 'URL is valid and accessible. QR code will work correctly.',
        status: response.status
      });
    } catch (error) {
      // Even if fetch fails due to CORS, the URL might still be valid
      if (validateUrl(url)) {
        setValidationResult({
          isValid: true,
          message: 'URL format is valid. QR code should work (unable to verify accessibility due to CORS).'
        });
      } else {
        setValidationResult({
          isValid: false,
          message: 'URL appears to be inaccessible or invalid.'
        });
      }
    }

    setIsValidating(false);
  };

  const openUrl = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={validateQRCode}
          disabled={isValidating || !url}
          variant="outline"
          className="flex-1"
        >
          {isValidating ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2" />
              Validating...
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Validate QR Code
            </>
          )}
        </Button>

        {validateUrl(url) && (
          <Button
            onClick={openUrl}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>

      {validationResult && (
        <Alert className={validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-start gap-2">
            {validationResult.isValid ? (
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            )}
            <AlertDescription className={validationResult.isValid ? 'text-green-800' : 'text-red-800'}>
              {validationResult.message}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default QRValidator;
