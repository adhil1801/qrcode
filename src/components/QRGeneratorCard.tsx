
import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LoadingAnimation from '@/components/LoadingAnimation';
import AnimatedDownloadButton from '@/components/AnimatedDownloadButton';
import ShareButton from '@/components/ShareButton';

interface QRGeneratorCardProps {
  url: string;
  setUrl: (url: string) => void;
  qrSize: number[];
  fgColor: string;
  bgColor: string;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  downloaded: boolean;
  setDownloaded: (downloaded: boolean) => void;
  isDarkMode: boolean;
  onCopy: () => void;
}

const QRGeneratorCard: React.FC<QRGeneratorCardProps> = ({
  url,
  setUrl,
  qrSize,
  fgColor,
  bgColor,
  isGenerating,
  setIsGenerating,
  downloaded,
  setDownloaded,
  isDarkMode,
  onCopy
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  // Function to truncate URL if it's too long for QR code
  const getTruncatedUrl = (inputUrl: string, maxLength: number = 2000) => {
    if (inputUrl.length <= maxLength) {
      return inputUrl;
    }
    return inputUrl.substring(0, maxLength) + '...';
  };

  const downloadQRCode = () => {
    if (!url) return;
    
    setIsGenerating(true);
    
    // Small delay to show loading animation
    setTimeout(() => {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) {
        setIsGenerating(false);
        return;
      }

      // Create a canvas to convert SVG to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      const scaleFactor = 2; // For higher quality
      canvas.width = qrSize[0] * scaleFactor;
      canvas.height = qrSize[0] * scaleFactor;

      // Set background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Draw the image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Create download link
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.download = `qr-code-${Date.now()}.png`;
            downloadLink.href = downloadUrl;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Cleanup
            URL.revokeObjectURL(downloadUrl);
            
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
          }
        }, 'image/png', 1.0);
        
        // Cleanup
        URL.revokeObjectURL(svgUrl);
        setIsGenerating(false);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        setIsGenerating(false);
      };

      img.src = svgUrl;
    }, 500);
  };

  return (
    <Card className={`shadow-2xl border-0 ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-green-300/20' : 'border-white/20'}`}>
      <CardHeader className={`text-center pb-6 ${isDarkMode ? 'bg-gradient-to-r from-black/60 to-green-900/30' : 'bg-gradient-to-r from-white/60 to-purple-100/30'} rounded-t-lg border-b ${isDarkMode ? 'border-green-300/20' : 'border-white/20'}`}>
        <CardTitle className={`text-3xl ${isDarkMode ? 'text-green-300' : 'text-gray-800'} flex items-center justify-center gap-3`}>
          <Zap className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-violet-600'}`} />
          QR Code Generator
        </CardTitle>
        <p className={`${isDarkMode ? 'text-green-400' : 'text-gray-600'} mt-2`}>Enter your URL and generate your QR code</p>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        {/* URL Input Section */}
        <div className="space-y-4">
          <Label className={`text-lg font-bold ${isDarkMode ? 'text-green-300' : 'text-gray-800'} flex items-center gap-2`}>
            <QrCode className="w-5 h-5" />
            Website URL
          </Label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`text-lg h-14 border-2 ${isDarkMode ? 'border-green-500 focus:border-violet-500 bg-black/40 text-green-300 placeholder:text-green-500' : 'border-gray-300 focus:border-violet-500 bg-white/40 text-gray-800 placeholder:text-gray-500'} transition-colors duration-200 rounded-xl shadow-inner`}
          />
        </div>

        {/* QR Code Display - Show only when URL is provided */}
        {url && (
          <div className="flex flex-col items-center space-y-6">
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-4">
                <LoadingAnimation />
                <p className={`${isDarkMode ? 'text-green-300' : 'text-gray-600'}`}>Generating your QR code...</p>
              </div>
            ) : (
              <div 
                ref={qrRef}
                className={`p-6 rounded-2xl shadow-xl border-2 ${isDarkMode ? 'border-green-300/30' : 'border-white/30'} hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden`}
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
                <QRCode
                  size={qrSize[0]}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={getTruncatedUrl(url)}
                  viewBox={`0 0 ${qrSize[0]} ${qrSize[0]}`}
                  bgColor={bgColor}
                  fgColor={fgColor}
                />
              </div>
            )}

            <div className="flex gap-4 items-center">
              <AnimatedDownloadButton 
                onClick={downloadQRCode}
                disabled={isGenerating || !url}
                downloaded={downloaded}
              />
              
              <ShareButton url={url} onCopy={onCopy} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRGeneratorCard;
