import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { gql, type DocumentNode } from '@apollo/client';
import { useQuery } from '@vue/apollo-composable';
import personStatusSource from '@/graphql/operations/crm-person-status.graphql?raw';
import companyStatusSource from '@/graphql/operations/crm-saved-company-status.graphql?raw';

interface SavedRecord {
  id: string;
  linkedinUrn: string;
}

interface LookupVariables {
  linkedinUrn: string;
}

export function useCrmPersonStatus(
  linkedinUrn: MaybeRefOrGetter<string | undefined>,
  enabled: MaybeRefOrGetter<boolean>,
) {
  const query = useQuery<{ person: SavedRecord | null }, LookupVariables>(
    gql(personStatusSource) as DocumentNode,
    {
      variables: computed(() => ({ linkedinUrn: toValue(linkedinUrn) || '' })),
      fetchPolicy: 'network-only',
      enabled,
    },
  );

  return {
    isSaved: computed(() => !!query.result.value?.person),
    recordId: computed(() => query.result.value?.person?.id),
    loading: query.loading,
    error: query.error,
  };
}

export function useCrmCompanySavedStatus(
  linkedinUrn: MaybeRefOrGetter<string | undefined>,
  enabled: MaybeRefOrGetter<boolean>,
) {
  const query = useQuery<{ company: SavedRecord | null }, LookupVariables>(
    gql(companyStatusSource) as DocumentNode,
    {
      variables: computed(() => ({ linkedinUrn: toValue(linkedinUrn) || '' })),
      fetchPolicy: 'network-only',
      enabled,
    },
  );

  return {
    isSaved: computed(() => !!query.result.value?.company),
    recordId: computed(() => query.result.value?.company?.id),
    loading: query.loading,
    error: query.error,
  };
}
