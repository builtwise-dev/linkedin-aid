import { computed, type MaybeRefOrGetter } from 'vue';
import { gql, type DocumentNode } from '@apollo/client';
import { useQuery } from '@vue/apollo-composable';
import crmCompaniesSource from '@/graphql/operations/crm-companies.graphql?raw';
import crmInteractionsSource from '@/graphql/operations/crm-interactions.graphql?raw';
import crmPeopleSource from '@/graphql/operations/crm-people.graphql?raw';
import crmNotesSource from '@/graphql/operations/crm-notes.graphql?raw';
import crmTagsSource from '@/graphql/operations/crm-tags.graphql?raw';
import crmTasksSource from '@/graphql/operations/crm-tasks.graphql?raw';

export interface CrmPerson {
  id: string;
  linkedinUrn: string;
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  currentTitle?: string | null;
  currentCompanyName?: string | null;
  lifecycleStage: string;
  connectionStatus: string;
  outreachStatus: string;
  companyRelationships: { companyId: string; roleTitle?: string | null; isCurrent: boolean; company: { id: string; name: string } }[];
  updatedAt: string;
}

export interface CrmCompany {
  id: string;
  linkedinUrn: string;
  name: string;
  industry?: string | null;
  location?: string | null;
  lifecycleStage: string;
  accountClassification: string;
  peopleCount?: number;
  updatedAt: string;
}

export interface CrmTag { id: string; name: string; createdAt: string }
export interface CrmNote { id: string; body: string; personId?: string | null; companyId?: string | null; createdAt: string }
export interface CrmTask { id: string; title: string; description?: string | null; status: string; dueAt?: string | null; personId?: string | null; companyId?: string | null; updatedAt: string }
export interface CrmInteraction { id: string; kind: string; summary?: string | null; channel?: string | null; outcome?: string | null; occurredAt: string; personId?: string | null; companyId?: string | null }

function useCrmQuery<TData>(source: string, enabled: MaybeRefOrGetter<boolean> = true) {
  return useQuery<{ [key: string]: TData }>(gql(source) as DocumentNode, {
    fetchPolicy: 'network-only',
    enabled,
  });
}

export function useCrmPeople(enabled: MaybeRefOrGetter<boolean> = true) {
  const query = useCrmQuery<CrmPerson[]>(crmPeopleSource, enabled);
  return { ...query, records: computed(() => query.result.value?.people ?? []) };
}

export function useCrmCompanies(enabled: MaybeRefOrGetter<boolean> = true) {
  const query = useCrmQuery<CrmCompany[]>(crmCompaniesSource, enabled);
  return { ...query, records: computed(() => query.result.value?.companies ?? []) };
}

export function useCrmTags(enabled: MaybeRefOrGetter<boolean> = true) {
  const query = useCrmQuery<CrmTag[]>(crmTagsSource, enabled);
  return { ...query, records: computed(() => query.result.value?.crmTags ?? []) };
}

export function useCrmNotes(enabled: MaybeRefOrGetter<boolean> = true) {
  const query = useCrmQuery<CrmNote[]>(crmNotesSource, enabled);
  return { ...query, records: computed(() => query.result.value?.crmNotes ?? []) };
}

export function useCrmTasks(enabled: MaybeRefOrGetter<boolean> = true) {
  const query = useCrmQuery<CrmTask[]>(crmTasksSource, enabled);
  return { ...query, records: computed(() => query.result.value?.crmTasks ?? []) };
}

export function useCrmInteractions(enabled: MaybeRefOrGetter<boolean> = true) {
  const query = useCrmQuery<CrmInteraction[]>(crmInteractionsSource, enabled);
  return { ...query, records: computed(() => query.result.value?.crmInteractions ?? []) };
}

export function formatCrmDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}
