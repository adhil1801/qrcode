
import React from 'react';
import { Facebook, Twitter, Share2 } from 'lucide-react';
import './ShareButton.css';

interface ShareButtonProps {
  url: string;
  onCopy: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, onCopy }) => {
  const shareToSocial = (platform: string) => {
    const text = `Check out this QR code for: ${url}`;
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="tooltip-container">
      <div className="button-content">
        <span className="text">Share</span>
        <Share2 className="share-icon" size={20} />
      </div>
      <div className="tooltip-content">
        <div className="social-icons">
          <div className="social-icon twitter" onClick={() => shareToSocial('twitter')}>
            <Twitter size={24} />
          </div>
          <div className="social-icon facebook" onClick={() => shareToSocial('facebook')}>
            <Facebook size={24} />
          </div>
          <div className="social-icon linkedin" onClick={onCopy}>
            <Share2 size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareButton;
