import { computed } from 'vue';
import { findSearchSessionForTabUrl } from '@/helpers/search-url-helpers';
import { useDataStore } from '@/store/data-store';
import { SearchSessionSource } from '@/types/search/search';

export function useSearchSessions(tabUrl?: string) {
  const { searchSessionsMap, loadData } = useDataStore();

  const searchSessions = computed(() => {
    return Object.values(searchSessionsMap.value).sort((a, b) => b.updatedAt - a.updatedAt);
  });

  const searchPageSearchSessions = computed(() => {
    return searchSessions.value.filter(s => s.source === SearchSessionSource.SEARCH);
  });

  const currentSearchSession = computed(() => {
    if (!tabUrl) return null;
    return findSearchSessionForTabUrl(searchSessions.value, tabUrl);
  });

  const getSearchSessionsByCompany = (companyUrn: string, source?: SearchSessionSource) => {
    return searchSessions.value.filter(s => s.companyUrn === companyUrn && (!source || s.source === source));
  };

  return {
    searchSessions,
    searchPageSearchSessions,
    currentSearchSession,
    getSearchSessionsByCompany,
    loadSearchSessions: loadData,
  };
}
