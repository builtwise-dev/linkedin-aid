import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { gql, type DocumentNode } from '@apollo/client';
import { useQuery } from '@vue/apollo-composable';
import leadStatusSource from '@/graphql/operations/crm-saved-lead-status.graphql?raw';
import companyStatusSource from '@/graphql/operations/crm-saved-company-status.graphql?raw';

interface SavedRecord {
  id: string;
  linkedinUrn: string;
}

interface LookupVariables {
  linkedinUrn: string;
}

export function useCrmLeadSavedStatus(
  linkedinUrn: MaybeRefOrGetter<string | undefined>,
  enabled: MaybeRefOrGetter<boolean>,
) {
  const query = useQuery<{ savedLead: SavedRecord | null }, LookupVariables>(
    gql(leadStatusSource) as DocumentNode,
    {
      variables: computed(() => ({ linkedinUrn: toValue(linkedinUrn) || '' })),
      fetchPolicy: 'network-only',
      enabled,
    },
  );

  return {
    isSaved: computed(() => !!query.result.value?.savedLead),
    recordId: computed(() => query.result.value?.savedLead?.id),
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
