import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lamovie.agency';
  const fullTitle = `${title} | LA MOVIE`;
  const defaultImage = 'https://storage.googleapis.com/creatorspace-public/users%2Fclgdrmzuo005mqs0yl9dsh3a8%2FzpX6RGPZgMm6FjEx-_DSC0650.jpg';
  const finalImage = image || defaultImage;
  const finalKeywords = keywords || 'Agencia Marketing Digital, Producción Audiovisual, Reels, TikTok Marketing, Automatización IA, Branding, Diseño Web, LA MOVIE';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      
      <link rel="canonical" href={siteUrl} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
