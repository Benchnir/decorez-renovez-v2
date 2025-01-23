import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

interface SocialShareProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  image,
  url,
}) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${url}`;

  return (
    <div className="flex space-x-4">
      <FacebookShareButton
        url={shareUrl}
        quote={title}
        hashtag="#DecorezRenovez"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={shareUrl}
        title={title}
        hashtags={['DecorezRenovez', 'Renovation', 'Design']}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton
        url={shareUrl}
        title={title}
        summary={description}
        source="Décorez-Rénovez"
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={title}
        separator=" - "
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
};

export default SocialShare;
