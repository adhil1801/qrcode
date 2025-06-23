import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, QrCode, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadQRCode = () => {
    if (!url) {
      toast({
        title: "No URL provided",
        description: "Please enter a URL to generate a QR code",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) {
        setIsGenerating(false);
        toast({
          title: "Download failed",
          description: "Could not find QR code to download",
          variant: "destructive",
        });
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsGenerating(false);
          toast({
            title: "Download failed",
            description: "Canvas not supported in your browser",
            variant: "destructive",
          });
          return;
        }

        const size = 512;
        canvas.width = size;
        canvas.height = size;

        // Set white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob);
              const downloadLink = document.createElement('a');
              downloadLink.download = `qr-code-${Date.now()}.png`;
              downloadLink.href = downloadUrl;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              URL.revokeObjectURL(downloadUrl);
              
              toast({
                title: "Download successful",
                description: "QR code has been downloaded as PNG",
              });
            }
          }, 'image/png', 1.0);
          
          URL.revokeObjectURL(svgUrl);
          setIsGenerating(false);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          setIsGenerating(false);
          toast({
            title: "Download failed",
            description: "Could not process QR code image",
            variant: "destructive",
          });
        };

        img.src = svgUrl;
      } catch (error) {
        setIsGenerating(false);
        toast({
          title: "Download failed",
          description: "An error occurred while downloading",
          variant: "destructive",
        });
      }
    }, 300);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            QR Code Generator
          </h1>
          <p className="text-lg text-gray-600">
            Enter any URL to generate a QR code instantly
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
              <Link className="w-6 h-6 text-blue-600" />
              Generate QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Website URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-lg h-12 border-2 border-gray-300 focus:border-blue-500 transition-colors"
              />
              {url && !isValidUrl(url) && (
                <p className="text-sm text-red-500">
                  Please enter a valid URL (including http:// or https://)
                </p>
              )}
            </div>

            {/* QR Code Display */}
            {url && isValidUrl(url) && (
              <div className="flex flex-col items-center space-y-6">
                <div 
                  ref={qrRef}
                  className="p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200"
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={url}
                    viewBox="0 0 256 256"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <Button
                  onClick={downloadQRCode}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download PNG
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Enter a valid URL (must include http:// or https://)</li>
                <li>2. Your QR code will appear automatically</li>
                <li>3. Click "Download PNG" to save the QR code</li>
              </ol>
            </div>

            {/* URL Info */}
            {url && isValidUrl(url) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">QR Code Details:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">URL:</span> {url}</p>
                  <p><span className="font-medium">Size:</span> 256x256 pixels</p>
                  <p><span className="font-medium">Format:</span> PNG</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Simply enter any URL and get your QR code instantly!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;