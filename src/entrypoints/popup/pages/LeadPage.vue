<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLeads } from '@/composables/useLeads';
import { useAuth } from '@/composables/useAuth';
import { useCrmSave } from '@/composables/useCrmSave';
import { useCrmLeadSavedStatus } from '@/composables/useCrmSavedStatus';
import { getLeadAvatarUrl } from '@/helpers/lead-helper';
import CrmSaveControl from '@/components/crm/CrmSaveControl.vue';
import LeadPreview from '../../../components/leads/LeadPreview.vue';

interface Props {
  tabUrl: string;
}
const props = defineProps<Props>();

const { currentUrlLead } = useLeads(props.tabUrl);
const { user, loading: authLoading } = useAuth();
const { saveLead, unsaveLead, savingLead, removingLead } = useCrmSave();
const saveMessage = ref('');
const saveError = ref(false);
const savedByMutationUrn = ref<string | null>(null);
const savedByMutationId = ref<string | null>(null);
const { isSaved: apiIsSaved, recordId: savedLeadId, loading: statusLoading, error: statusError } = useCrmLeadSavedStatus(
  computed(() => currentUrlLead.value?.entityUrn),
  computed(() => !!user.value && !!currentUrlLead.value?.entityUrn),
);
const isSaved = computed(() => savedByMutationUrn.value === currentUrlLead.value?.entityUrn || apiIsSaved.value);
const locallyRemovedUrn = ref<string | null>(null);
const crmSaved = computed(() => isSaved.value && locallyRemovedUrn.value !== currentUrlLead.value?.entityUrn);

const validWebUrl = (value?: string | null) => value && /^https?:\/\//i.test(value) ? value : undefined;

const saveCurrentLead = async () => {
  const lead = currentUrlLead.value;
  if (!lead || !user.value) return;

  const position = lead.main?.positions?.find(item => item.current)
    || lead.searchResult?.currentPositions?.find(item => item.current)
    || lead.main?.positions?.[0]
    || lead.searchResult?.currentPositions?.[0];

  saveMessage.value = '';
  saveError.value = false;
  try {
    const result = await saveLead({
      variables: {
        input: {
          linkedinUrn: lead.entityUrn,
          profileUrl: validWebUrl(lead.profileUrl),
          firstName: lead.main?.firstName || lead.searchResult?.firstName,
          lastName: lead.main?.lastName || lead.searchResult?.lastName,
          headline: lead.main?.headline,
          location: lead.main?.location || lead.searchResult?.geoRegion,
          currentTitle: position?.title,
          currentCompanyName: position?.companyName,
          currentCompanyLinkedinUrn: position?.companyUrn,
          profileImageUrl: validWebUrl(getLeadAvatarUrl(lead)),
        },
      },
    });
    savedByMutationUrn.value = lead.entityUrn;
    savedByMutationId.value = result?.data?.saveLead.id || null;
    locallyRemovedUrn.value = null;
    saveMessage.value = '';
  } catch (error) {
    saveError.value = true;
    saveMessage.value = error instanceof Error ? error.message : 'Could not save this lead to CRM.';
  }
};

const removeCurrentLead = async () => {
  const leadId = savedLeadId.value || savedByMutationId.value;
  if (!leadId || !confirm('Remove this lead from your CRM?')) return;
  saveMessage.value = '';
  saveError.value = false;
  try {
    await unsaveLead({ variables: { leadId } });
    locallyRemovedUrn.value = currentUrlLead.value?.entityUrn || null;
    savedByMutationUrn.value = null;
    savedByMutationId.value = null;
  } catch (error) {
    saveError.value = true;
    saveMessage.value = error instanceof Error ? error.message : 'Could not remove this lead from CRM.';
  }
};
</script>

<template>
  <div class="lead-page">
    <CrmSaveControl
      v-if="currentUrlLead"
      :authenticated="!!user"
      :auth-loading="authLoading"
      :checking="statusLoading"
      :saving="savingLead"
      :saved="crmSaved"
      :removing="removingLead"
      :status-error="statusError?.message || ''"
      :message="saveMessage"
      :message-error="saveError"
      class="mb-2"
      @save="saveCurrentLead"
      @unsave="removeCurrentLead"
    />

    <LeadPreview
      v-if="currentUrlLead"
      :lead="currentUrlLead"
    />
    <div v-else class="no-data">
      No leads collected yet. Navigate to a Sales Navigator lead profile to collect data.
    </div>
  </div>
</template>

<style scoped>
.lead-page {
  padding: 10px;
}

</style>
