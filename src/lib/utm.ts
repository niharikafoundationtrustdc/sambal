export const getUTMParams = () => {
  if (typeof window === 'undefined') return {};
  
  const searchParams = new URLSearchParams(window.location.search);
  const params = {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
  };

  // Persist to session storage if present in URL
  if (params.utm_source || params.utm_medium || params.utm_campaign) {
    sessionStorage.setItem('sambal_utm', JSON.stringify(params));
  }

  // Retrieve from session storage if not in URL
  const stored = sessionStorage.getItem('sambal_utm');
  if (stored && !params.utm_source) {
    return JSON.parse(stored);
  }

  return params;
};
