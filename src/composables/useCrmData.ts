import { computed } from 'vue';
import { gql } from '@apollo/client';
import { useQuery } from '@vue/apollo-composable';
import crmDataQuerySource from '@/graphql/operations/crm-data.graphql?raw';

const CRM_DATA_QUERY = gql(crmDataQuerySource);

interface CrmData {
  savedLeads: Array<{ id: string; linkedinUrn: string; firstName?: string | null; lastName?: string | null; headline?: string | null; currentTitle?: string | null; currentCompanyName?: string | null; status: string; updatedAt: string }>;
  companies: Array<{ id: string; linkedinUrn: string; name: string; industry?: string | null; location?: string | null; status: string; updatedAt: string }>;
  crmNotes: Array<{ id: string; body: string; savedLeadId?: string | null; companyId?: string | null; createdAt: string }>;
  crmTags: Array<{ id: string; name: string; createdAt: string }>;
  crmTasks: Array<{ id: string; title: string; description?: string | null; status: string; dueAt?: string | null; savedLeadId?: string | null; companyId?: string | null; updatedAt: string }>;
  crmInteractions: Array<{ id: string; kind: string; summary?: string | null; channel?: string | null; outcome?: string | null; occurredAt: string; savedLeadId?: string | null; companyId?: string | null }>;
}

export function useCrmData() {
  const { result, loading, error, refetch } = useQuery<CrmData>(CRM_DATA_QUERY, {
    fetchPolicy: 'network-only',
  });

  const data = computed(() => result.value);
  const counts = computed(() => ({
    leads: data.value?.savedLeads.length ?? 0,
    companies: data.value?.companies.length ?? 0,
    notes: data.value?.crmNotes.length ?? 0,
    tags: data.value?.crmTags.length ?? 0,
    tasks: data.value?.crmTasks.length ?? 0,
    interactions: data.value?.crmInteractions.length ?? 0,
  }));

  return { data, counts, loading, error, refetch };
}

export function formatCrmDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}
