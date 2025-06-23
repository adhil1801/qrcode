import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, QrCode, Settings, Palette, Ruler, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Iridescence from '@/components/Iridescence';
import QRValidator from '@/components/QRValidator';
import ClickSpark from '@/components/ClickSpark';
import ProfileCard from '@/components/ProfileCard';
import QRScanner from '@/components/QRScanner';
import LoadingAnimation from '@/components/LoadingAnimation';
import ShareButton from '@/components/ShareButton';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import AnimatedDownloadButton from '@/components/AnimatedDownloadButton';
import SimpleThemeToggle from '@/components/SimpleThemeToggle';
import LoginForm from '@/components/LoginForm';
import SignUpForm from '@/components/SignUpForm';
import CookieNotice from '@/components/CookieNotice';

const Index = () => {
  const [url, setUrl] = useState('');
  const [qrSize, setQrSize] = useState([256]);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showCustomization, setShowCustomization] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to truncate URL if it's too long for QR code
  const getTruncatedUrl = (inputUrl: string, maxLength: number = 2000) => {
    if (inputUrl.length <= maxLength) {
      return inputUrl;
    }
    return inputUrl.substring(0, maxLength) + '...';
  };

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
    
    // Small delay to show loading animation
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
        // Create a canvas to convert SVG to PNG
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
              
              toast({
                title: "Download successful",
                description: "QR code has been downloaded as PNG",
              });
            } else {
              toast({
                title: "Download failed",
                description: "Could not create image file",
                variant: "destructive",
              });
            }
          }, 'image/png', 1.0);
          
          // Cleanup
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
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied to clipboard",
        description: "URL has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <SmoothCursor />
      <CookieNotice />
      
      {/* Iridescence Background */}
      <Iridescence 
        color={isDarkMode ? [0.1, 0.1, 0.1] : [0.9, 0.95, 1]}
        amplitude={0.3}
        speed={0.8}
      />
      
      <div className={`relative z-10 min-h-screen ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-sm`}>
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <SimpleThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
        </div>

        {/* Auth Buttons */}
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <Button 
            onClick={() => setShowLogin(true)} 
            variant="outline"
            className={isDarkMode ? 'text-white border-white hover:bg-white hover:text-black' : ''}
          >
            Login
          </Button>
          <Button 
            onClick={() => setShowSignUp(true)} 
            variant="outline"
            className={isDarkMode ? 'text-white border-white hover:bg-white hover:text-black' : ''}
          >
            Sign Up
          </Button>
        </div>

        <div className="max-w-7xl mx-auto pt-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-green-500 via-violet-500 to-green-500' : 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500'} rounded-full blur-lg opacity-75 animate-pulse`}></div>
                <div className={`relative p-4 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-sm rounded-full border ${isDarkMode ? 'border-green-300/30' : 'border-white/30'}`}>
                  <QrCode className={`w-12 h-12 ${isDarkMode ? 'text-green-400' : 'text-gray-800'}`} />
                </div>
              </div>
            </div>
            
            <h1 className={`text-6xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-green-400 via-violet-400 to-green-400' : 'bg-gradient-to-r from-gray-800 via-purple-600 to-violet-600'} bg-clip-text text-transparent mb-4`}>
              QR Code Generator
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-green-300' : 'text-gray-700'} mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Create stunning, customizable QR codes instantly. Perfect for sharing URLs, contact info, and more with beautiful design options.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-sm rounded-xl border ${isDarkMode ? 'border-green-300/30' : 'border-white/30'}`}>
                <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-yellow-600'}`} />
                <span className={`${isDarkMode ? 'text-green-300' : 'text-gray-800'} font-medium`}>Instant Generation</span>
              </div>
              <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-sm rounded-xl border ${isDarkMode ? 'border-violet-300/30' : 'border-white/30'}`}>
                <Palette className={`w-6 h-6 ${isDarkMode ? 'text-violet-400' : 'text-purple-600'}`} />
                <span className={`${isDarkMode ? 'text-violet-300' : 'text-gray-800'} font-medium`}>Full Customization</span>
              </div>
              <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-sm rounded-xl border ${isDarkMode ? 'border-green-300/30' : 'border-white/30'}`}>
                <Shield className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-violet-600'}`} />
                <span className={`${isDarkMode ? 'text-green-300' : 'text-gray-800'} font-medium`}>URL Validation</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - 2 columns */}
              <div className="lg:col-span-2 space-y-8">
                {/* Main Content Card */}
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
                          
                          <ShareButton url={url} onCopy={copyToClipboard} />
                        </div>
                      </div>
                    )}

                    {/* Customization Toggle Button */}
                    <div className="flex justify-center">
                      <ClickSpark 
                        onClick={() => setShowCustomization(!showCustomization)}
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          className={`flex items-center gap-3 ${isDarkMode ? 'bg-gradient-to-r from-green-100/50 to-violet-100/50 hover:from-green-200/60 hover:to-violet-200/60 border-2 border-green-300/50 hover:border-green-400/70 text-green-300' : 'bg-gradient-to-r from-violet-100/50 to-purple-100/50 hover:from-violet-200/60 hover:to-purple-200/60 border-2 border-violet-300/50 hover:border-violet-400/70 text-gray-800'} transition-all duration-300 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105`}
                        >
                          <Settings className="w-6 h-6" />
                          {showCustomization ? 'Hide Customization' : 'Customize Your QR Code'}
                        </Button>
                      </ClickSpark>
                    </div>

                    {/* Customization Panel - Show only when toggled */}
                    {showCustomization && (
                      <div className="space-y-8 animate-fade-in">
                        {/* QR Validation Section */}
                        <div className={`space-y-4 p-6 ${isDarkMode ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-300/50' : 'bg-gradient-to-r from-green-100/40 to-emerald-100/40 border-2 border-green-300/50'} rounded-xl`}>
                          <Label className={`text-lg font-bold ${isDarkMode ? 'text-green-300' : 'text-gray-800'} flex items-center gap-2`}>
                            <Shield className="w-5 h-5" />
                            QR Code Validation
                          </Label>
                          <QRValidator url={url} />
                        </div>

                        {/* Size Control Section */}
                        <div className={`space-y-4 p-6 ${isDarkMode ? 'bg-gradient-to-r from-violet-900/40 to-purple-900/40 border-2 border-violet-300/50' : 'bg-gradient-to-r from-violet-100/40 to-purple-100/40 border-2 border-violet-300/50'} rounded-xl hover:scale-105 transition-transform duration-300`}>
                          <Label className={`text-lg font-bold ${isDarkMode ? 'text-violet-300' : 'text-gray-800'} flex items-center gap-2`}>
                            <Ruler className="w-5 h-5" />
                            QR Code Size
                          </Label>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-gray-600'} font-medium`}>128px</span>
                              <span className={`font-bold ${isDarkMode ? 'text-violet-400 bg-violet-900/60' : 'text-violet-600 bg-violet-100/60'} px-4 py-2 rounded-full text-lg hover:scale-110 transition-transform duration-200`}>
                                {qrSize[0]}px
                              </span>
                              <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-gray-600'} font-medium`}>400px</span>
                            </div>
                            <div className="hover:scale-105 transition-transform duration-200">
                              <Slider
                                value={qrSize}
                                onValueChange={setQrSize}
                                max={400}
                                min={128}
                                step={32}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Color Customization Section */}
                        <div className={`space-y-6 p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-900/40 to-violet-900/40 border-2 border-purple-300/50' : 'bg-gradient-to-r from-purple-100/40 to-violet-100/40 border-2 border-purple-300/50'} rounded-xl`}>
                          <Label className={`text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-gray-800'} flex items-center gap-2`}>
                            <Palette className="w-5 h-5" />
                            Color Theme
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <Label className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-gray-700'}`}>QR Code Color</Label>
                              <div className={`flex items-center space-x-4 p-4 ${isDarkMode ? 'bg-black/40 border-2 border-green-300/30' : 'bg-white/40 border-2 border-white/30'} rounded-xl shadow-inner`}>
                                <input
                                  type="color"
                                  value={fgColor}
                                  onChange={(e) => setFgColor(e.target.value)}
                                  className="w-16 h-16 rounded-xl border-3 border-gray-300 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                                />
                                <div className="flex-1">
                                  <Input
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className={`font-mono text-sm ${isDarkMode ? 'border-green-300 bg-black/40 text-green-300' : 'border-gray-300 bg-white/40 text-gray-800'}`}
                                    placeholder="#000000"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Label className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-gray-700'}`}>Background Color</Label>
                              <div className={`flex items-center space-x-4 p-4 ${isDarkMode ? 'bg-black/40 border-2 border-green-300/30' : 'bg-white/40 border-2 border-white/30'} rounded-xl shadow-inner`}>
                                <input
                                  type="color"
                                  value={bgColor}
                                  onChange={(e) => setBgColor(e.target.value)}
                                  className="w-16 h-16 rounded-xl border-3 border-gray-300 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                                />
                                <div className="flex-1">
                                  <Input
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className={`font-mono text-sm ${isDarkMode ? 'border-green-300 bg-black/40 text-green-300' : 'border-gray-300 bg-white/40 text-gray-800'}`}
                                    placeholder="#ffffff"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* QR Code Info */}
                    {url && (
                      <div className={`w-full p-6 ${isDarkMode ? 'bg-gradient-to-r from-black/60 to-green-900/30 border border-green-300/30' : 'bg-gradient-to-r from-white/60 to-violet-100/30 border border-white/30'} rounded-xl`}>
                        <h3 className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-gray-800'} mb-3 flex items-center gap-2`}>
                          <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-yellow-600'}`} />
                          QR Code Details
                        </h3>
                        <div className={`space-y-2 text-sm ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}>
                          <p><span className="font-medium">Size:</span> {qrSize[0]}px × {qrSize[0]}px</p>
                          <p><span className="font-medium">Format:</span> PNG</p>
                          <p><span className="font-medium">URL:</span> <span className="break-all">{url}</span></p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - 1 column */}
              <div className="space-y-8">
                {/* QR Profile Card - Show only when URL is provided */}
                {url && (
                  <div className="flex justify-center">
                    <ProfileCard 
                      url={url}
                      qrSize={180}
                      qrFgColor={fgColor}
                      qrBgColor={bgColor}
                      className="w-full max-w-sm"
                      behindGradient={isDarkMode ? 
                        "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(120,100%,50%,var(--card-opacity)) 4%,hsla(120,50%,40%,calc(var(--card-opacity)*0.75)) 10%,hsla(120,25%,30%,calc(var(--card-opacity)*0.5)) 50%,hsla(120,0%,20%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ff88c4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00ff88ff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#22c55eff 0%,#8b5cf6ff 40%,#8b5cf6ff 60%,#22c55eff 100%)" :
                        "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#000000ff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#22c55eff 0%,#8b5cf6ff 40%,#8b5cf6ff 60%,#22c55eff 100%)"
                      }
                      innerGradient={isDarkMode ? "linear-gradient(145deg,#0a0a0a 0%,#1a1a1a 100%)" : "linear-gradient(145deg,#ffffff 0%,#f8fafc 100%)"}
                    />
                  </div>
                )}
                
                {/* QR Scanner */}
                <QRScanner />
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-16 text-center pb-8">
            <p className={`${isDarkMode ? 'text-green-300' : 'text-gray-700'} text-lg`}>
              🎨 Your QR code updates automatically as you customize it
            </p>
            <p className={`${isDarkMode ? 'text-green-400' : 'text-gray-600'} text-sm mt-2`}>
              Powered by advanced QR generation technology with beautiful iridescent effects
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}
    </div>
  );
};

export default Index;