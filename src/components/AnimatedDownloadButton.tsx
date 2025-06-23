
import React from 'react';
import { Download, CheckIcon } from 'lucide-react';

interface AnimatedDownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  downloaded: boolean;
}

const AnimatedDownloadButton: React.FC<AnimatedDownloadButtonProps> = ({ onClick, disabled, downloaded }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative w-40 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    >
      <span className={`inline-flex items-center justify-center w-full transition-all duration-300 ${downloaded ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        Download
        <Download className="ml-2 size-4 transition-transform duration-300 group-hover:translate-y-1" />
      </span>
      <span className={`absolute inset-0 inline-flex items-center justify-center transition-all duration-300 ${downloaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <CheckIcon className="mr-2 size-4" />
        Downloaded
      </span>
    </button>
  );
};

export default AnimatedDownloadButton;
