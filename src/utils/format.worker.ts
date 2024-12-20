import { createStreaming, GlobalConfiguration } from '@dprint/formatter';
import { LanguageType } from './extensions-manager';

interface FormatRequest {
  code: string;
  fileName: string;
}

const CACHE_NAME = 'dprint-plugins';

const TYPESCRIPT_PLUGIN = 'https://plugins.dprint.dev/typescript-0.93.3.wasm';
const JSON_PLUGIN = 'https://plugins.dprint.dev/json-0.19.4.wasm';
const MD_PLUGIN = 'https://plugins.dprint.dev/markdown-0.17.8.wasm';

const globalConfig: GlobalConfiguration = {
  indentWidth: 2,
  lineWidth: 80,
};

let formatterInstance: Awaited<ReturnType<typeof createStreaming>> | null =
  null;

async function getOrCreateFormatter(type: LanguageType) {
  if (formatterInstance) {
    return formatterInstance;
  }

  let url = TYPESCRIPT_PLUGIN;
  if (type === LanguageType.Markdown) {
    url = MD_PLUGIN;
  } else if (type === LanguageType.JSON) {
    url = JSON_PLUGIN;
  }
  const pluginBytes = await getCachedPlugin(url);

  const extraConfig = type === LanguageType.JavaScript
    ? {
      semiColons: 'asi',
      quoteStyle: 'preferSingle',
    }
    : {};
  try {
    formatterInstance = await createStreaming(pluginBytes);
    formatterInstance.setConfig(globalConfig, { ...extraConfig });
    return formatterInstance;
  } catch (error) {
    console.error('Failed to create formatter:', error);
    formatterInstance = null;
    throw error;
  }
}
caches.open(CACHE_NAME).then(res => {
  console.log('res:', res);
});

async function getCachedPlugin(url: string): Promise<Response> {
  try {
    // Try to get from Cache API
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      // Get the cached plugin as ArrayBuffer
      return cachedResponse;
    }

    // If not in cache, fetch and cache it
    console.log('Fetching plugin from network');
    const response = await fetch(url);
    const clonedResponse = response.clone();

    // Store in cache
    await cache.put(url, clonedResponse);

    // Return the original response
    return response;
  } catch (error) {
    console.error('Cache operation failed:', error);
    // Fallback to direct network request if caching fails
    return fetch(url);
  }
}

// outputs: "const t = 5\n"

self.addEventListener('message', async (event: MessageEvent<FormatRequest>) => {
  try {
    const { code, fileName } = event.data;
    const type = fileName.split('.').at(-1);
    const formatter = await getOrCreateFormatter(type as LanguageType);
    const formatted = formatter.formatText({
      filePath: fileName,
      fileText: code,
    });
    self.postMessage(formatted);
  } catch (error) {
    console.log(error);
    self.postMessage('Format failed');
  }
});

// Handle cache cleanup on worker termination
self.addEventListener('unload', async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all([
      cache.delete(TYPESCRIPT_PLUGIN),
      cache.delete(JSON_PLUGIN),
      cache.delete(MD_PLUGIN),
    ]);
  } catch (error) {
    console.error('Failed to cleanup cache:', error);
  }
});
