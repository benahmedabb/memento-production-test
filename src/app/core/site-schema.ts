import { serviceEntries, siteConfig } from './site.config';

export const serviceAreas = siteConfig.serviceCities.map((name) => ({ '@type': 'City', name }));

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteConfig.origin}/#organization`,
  name: 'Memento Production',
  legalName: siteConfig.contact.legalName,
  description: 'Agenzia di comunicazione e marketing con sede a Moncalieri, per aziende di Torino, Pinerolo e Chieri: video e fotografia, social media, Google e Meta Ads, grafica, siti web ed e-commerce.',
  url: siteConfig.origin,
  logo: `${siteConfig.origin}/images/logo-memento-navbar.png`,
  image: `${siteConfig.origin}${siteConfig.socialPreviewImage}`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneHref.replace('tel:', ''),
  vatID: `IT${siteConfig.contact.vatNumber}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.contact.streetAddress,
    addressLocality: siteConfig.contact.city,
    postalCode: siteConfig.contact.postalCode,
    addressRegion: 'TO',
    addressCountry: 'IT',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 44.9745356, longitude: 7.7307929 },
  hasMap: siteConfig.contact.mapUrl,
  areaServed: serviceAreas,
  sameAs: [siteConfig.contact.instagramUrl],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi di comunicazione e marketing',
    itemListElement: serviceEntries.map(({ path, service }) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service.shortTitle, url: `${siteConfig.origin}${path}` },
    })),
  },
};
