import { Metadata } from "next";

export const siteUrl = "https://football-eyeq.com";
export const defaultOgImage = `${siteUrl}/brand/logo-full.png`;

interface BaseMetadataProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "product";
  image?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  image = defaultOgImage,
}: BaseMetadataProps): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Football EyeQ",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  path: string;
  price: string;
  currency: string;
  sku?: string;
  image?: string;
}

export function buildProductJsonLd({
  name,
  description,
  path,
  price,
  currency,
  sku = "FOOTBALL-EYEQ-PRO",
  image = defaultOgImage,
}: ProductJsonLdProps): Record<string, unknown> {
  const url = `${siteUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: {
      "@type": "Brand",
      name: "Football EyeQ",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price,
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
    },
  };
}
