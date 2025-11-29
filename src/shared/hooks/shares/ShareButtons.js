import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';

const ShareButtons = ({ url, title }) => {
  return (
    <div className="flex items-center gap-2">
      <FacebookShareButton 
        url={url} 
        quote={title}
        className="transition-transform duration-200 hover:scale-110"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton 
        url={url} 
        title={title}
        className="transition-transform duration-200 hover:scale-110"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton 
        url={url}
        className="transition-transform duration-200 hover:scale-110"
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareButtons;
