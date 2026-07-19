import type { ReactElement } from 'react'

/**
 * System-only theme policy. Running in <head> keeps the first paint stable;
 * the media-query listener keeps an open page in sync when the OS theme changes.
 * There is intentionally no preference storage or header control to maintain.
 * The component is also the integration point for the global 404 document.
 */
export function ThemeScript(): ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var root=document.documentElement;var query=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');function apply(event){var theme=event.matches?'dark':'light';root.dataset.theme=theme;root.style.colorScheme=theme}if(!query){root.dataset.theme='light';root.style.colorScheme='light';return}apply(query);if(query.addEventListener){query.addEventListener('change',apply)}else if(query.addListener){query.addListener(apply)}})();`,
      }}
    />
  )
}
