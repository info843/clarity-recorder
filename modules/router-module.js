import { getProductManifest } from './product-manifest.js';

export function resolveModuleView(runtimePayload, locale = 'en') {
  const runtime = runtimePayload?.runtime || {};
  const serverModule = runtimePayload?.module || {};
  const manifest = getProductManifest(runtime.productKey);
  if (!manifest) {
    return {
      supported: false,
      title: locale === 'de' ? 'Produkt nicht unterstützt' : 'Unsupported product',
      description: locale === 'de'
        ? 'Dieser Link verweist auf ein Produkt, das in der Universal App noch nicht registriert ist.'
        : 'This link refers to a product that is not registered in the Universal App.'
    };
  }
  return {
    supported: true,
    icon: manifest.icon,
    title: manifest.title[locale] || manifest.title.en,
    description: manifest.description[locale] || manifest.description.en,
    steps: manifest.steps,
    media: manifest.media,
    readiness: serverModule.readiness || 'unknown',
    startEnabled: serverModule.startEnabled === true,
    nextPhase: serverModule.nextPhase || '',
    route: serverModule.route || runtime.appRoute || ''
  };
}
