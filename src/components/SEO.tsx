import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  robots?: string;
  ogType?: 'website' | 'article' | 'hotel' | 'place' | 'profile';
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  robots,
  ogType = 'website',
  ogImage,
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    const previousTitle = document.title;
    document.title = title;

    // Helper to get or create a tag
    const getOrCreateMetaTag = (attributeValue: string, isProperty = false): HTMLMetaElement => {
      const selector = isProperty 
        ? `meta[property="${attributeValue}"]` 
        : `meta[name="${attributeValue}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', attributeValue);
        } else {
          element.setAttribute('name', attributeValue);
        }
        document.head.appendChild(element);
      }
      return element;
    };

    // 2. Meta description
    const descMeta = getOrCreateMetaTag('description');
    const prevDesc = descMeta.getAttribute('content') || '';
    descMeta.setAttribute('content', description);

    // 3. Meta keywords
    const keywordsMeta = getOrCreateMetaTag('keywords');
    const prevKeywords = keywordsMeta.getAttribute('content') || '';
    keywordsMeta.setAttribute('content', keywords);

    // 4. Meta robots
    let robotsMeta: HTMLMetaElement | null = null;
    let prevRobots = '';
    if (robots) {
      robotsMeta = getOrCreateMetaTag('robots');
      prevRobots = robotsMeta.getAttribute('content') || '';
      robotsMeta.setAttribute('content', robots);
    } else {
      const existingRobots = document.querySelector('meta[name="robots"]');
      if (existingRobots) {
        prevRobots = existingRobots.getAttribute('content') || '';
        existingRobots.removeAttribute('content');
      }
    }

    // 5. Canonical Link
    const currentUrl = canonical || window.location.origin + window.location.pathname;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    let prevCanonical = '';
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    } else {
      prevCanonical = canonicalLink.getAttribute('href') || '';
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 6. Open Graph Tags
    const ogTitleMeta = getOrCreateMetaTag('og:title', true);
    const prevOgTitle = ogTitleMeta.getAttribute('content') || '';
    ogTitleMeta.setAttribute('content', title);

    const ogDescMeta = getOrCreateMetaTag('og:description', true);
    const prevOgDesc = ogDescMeta.getAttribute('content') || '';
    ogDescMeta.setAttribute('content', description);

    const ogUrlMeta = getOrCreateMetaTag('og:url', true);
    const prevOgUrl = ogUrlMeta.getAttribute('content') || '';
    ogUrlMeta.setAttribute('content', currentUrl);

    const ogTypeMeta = getOrCreateMetaTag('og:type', true);
    const prevOgType = ogTypeMeta.getAttribute('content') || '';
    ogTypeMeta.setAttribute('content', ogType);

    const imageUrl = ogImage || window.location.origin + '/staysearch.jpeg';
    const ogImageMeta = getOrCreateMetaTag('og:image', true);
    const prevOgImage = ogImageMeta.getAttribute('content') || '';
    ogImageMeta.setAttribute('content', imageUrl);

    // 6.5. Twitter Card Tags
    const twitterCardMeta = getOrCreateMetaTag('twitter:card');
    const prevTwitterCard = twitterCardMeta.getAttribute('content') || '';
    twitterCardMeta.setAttribute('content', 'summary_large_image');

    const twitterTitleMeta = getOrCreateMetaTag('twitter:title');
    const prevTwitterTitle = twitterTitleMeta.getAttribute('content') || '';
    twitterTitleMeta.setAttribute('content', title);

    const twitterDescMeta = getOrCreateMetaTag('twitter:description');
    const prevTwitterDesc = twitterDescMeta.getAttribute('content') || '';
    twitterDescMeta.setAttribute('content', description);

    const twitterImageMeta = getOrCreateMetaTag('twitter:image');
    const prevTwitterImage = twitterImageMeta.getAttribute('content') || '';
    twitterImageMeta.setAttribute('content', imageUrl);

    // 7. Structured Schema Data
    let schemaScript: HTMLScriptElement | null = null;
    if (schema) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    return () => {
      // Restore previous metadata values on unmount
      document.title = previousTitle;
      
      if (prevDesc) {
        descMeta.setAttribute('content', prevDesc);
      } else {
        descMeta.removeAttribute('content');
      }

      if (prevKeywords) {
        keywordsMeta.setAttribute('content', prevKeywords);
      } else {
        keywordsMeta.removeAttribute('content');
      }

      if (robotsMeta) {
        if (prevRobots) {
          robotsMeta.setAttribute('content', prevRobots);
        } else {
          robotsMeta.remove();
        }
      }

      if (canonicalLink) {
        if (prevCanonical) {
          canonicalLink.setAttribute('href', prevCanonical);
        } else {
          canonicalLink.remove();
        }
      }

      if (ogTitleMeta) {
        if (prevOgTitle) ogTitleMeta.setAttribute('content', prevOgTitle);
        else ogTitleMeta.remove();
      }
      if (ogDescMeta) {
        if (prevOgDesc) ogDescMeta.setAttribute('content', prevOgDesc);
        else ogDescMeta.remove();
      }
      if (ogUrlMeta) {
        if (prevOgUrl) ogUrlMeta.setAttribute('content', prevOgUrl);
        else ogUrlMeta.remove();
      }
      if (ogTypeMeta) {
        if (prevOgType) ogTypeMeta.setAttribute('content', prevOgType);
        else ogTypeMeta.remove();
      }
      if (ogImageMeta) {
        if (prevOgImage) ogImageMeta.setAttribute('content', prevOgImage);
        else ogImageMeta.remove();
      }

      if (twitterCardMeta) {
        if (prevTwitterCard) twitterCardMeta.setAttribute('content', prevTwitterCard);
        else twitterCardMeta.remove();
      }
      if (twitterTitleMeta) {
        if (prevTwitterTitle) twitterTitleMeta.setAttribute('content', prevTwitterTitle);
        else twitterTitleMeta.remove();
      }
      if (twitterDescMeta) {
        if (prevTwitterDesc) twitterDescMeta.setAttribute('content', prevTwitterDesc);
        else twitterDescMeta.remove();
      }
      if (twitterImageMeta) {
        if (prevTwitterImage) twitterImageMeta.setAttribute('content', prevTwitterImage);
        else twitterImageMeta.remove();
      }

      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [title, description, keywords, canonical, robots, ogType, ogImage, schema]);

  return null; // Component does not render any visual UI elements
}
