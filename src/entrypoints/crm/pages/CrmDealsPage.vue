<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { gql, type DocumentNode } from '@apollo/client';
import { useMutation, useQuery } from '@vue/apollo-composable';
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useSnackbar } from '@/composables/useSnackbar';
import dealsSource from '@/graphql/operations/crm-deals.graphql?raw';
import saveDealSource from '@/graphql/operations/save-crm-deal.graphql?raw';
import moveDealSource from '@/graphql/operations/move-crm-deal.graphql?raw';
import deleteDealSource from '@/graphql/operations/delete-crm-deal.graphql?raw';
import createPipelineSource from '@/graphql/operations/create-crm-pipeline.graphql?raw';
import deletePipelineSource from '@/graphql/operations/delete-crm-pipeline.graphql?raw';

interface Stage { id: string; name: string; position: number; category: string }
interface Person { id: string; firstName?: string | null; lastName?: string | null }
interface Pipeline { id: string; name: string; isDefault: boolean; stages: Stage[] }
interface Deal {
  id: string; title: string; description?: string | null; amount?: string | null; currency: string;
  expectedCloseAt?: string | null; closedAt?: string | null; companyId: string; pipelineId: string;
  stageId: string; company: { id: string; name: string }; stage: Stage;
  people: { personId: string; person: Person }[]; updatedAt: string;
}
interface WorkspaceData { salesPipelines: Pipeline[]; dealsList: Deal[]; companies: { id: string; name: string }[]; people: Person[] }

const selectedPipelineId = ref('');
const query = useQuery<WorkspaceData, { pipelineId: string | null }>(
  gql(dealsSource) as DocumentNode,
  {
    variables: () => ({ pipelineId: selectedPipelineId.value || null }),
    fetchPolicy: 'network-only',
  },
);
const pipelines = computed(() => query.result.value?.salesPipelines ?? []);
const deals = computed(() => (query.result.value?.dealsList ?? []).filter((deal) => deal.pipelineId === selectedPipelineId.value));
const companies = computed(() => query.result.value?.companies ?? []);
const people = computed(() => query.result.value?.people ?? []);
const activePipeline = computed(() => pipelines.value.find((pipeline) => pipeline.id === selectedPipelineId.value) ?? pipelines.value[0]);
watch(pipelines, (items) => {
  if (!selectedPipelineId.value && items.length) selectedPipelineId.value = items.find((item) => item.isDefault)?.id ?? items[0].id;
}, { immediate: true });

const saveMutation = useMutation<{ saveDeal: { id: string } }, { input: Record<string, unknown> }>(gql(saveDealSource) as DocumentNode);
const moveMutation = useMutation<{ moveDealToStage: { id: string } }, { dealId: string; stageId: string }>(gql(moveDealSource) as DocumentNode);
const deleteMutation = useMutation<{ deleteDeal: boolean }, { dealId: string }>(gql(deleteDealSource) as DocumentNode);
const pipelineMutation = useMutation<{ createSalesPipeline: Pipeline }, { name: string; stages: string[] }>(gql(createPipelineSource) as DocumentNode);
const pipelineDeleteMutation = useMutation<{ deleteSalesPipeline: boolean }, { pipelineId: string }>(gql(deletePipelineSource) as DocumentNode);
const dealDialog = ref(false);
const pipelineDialog = ref(false);
const editingDeal = ref<Deal | null>(null);
const title = ref('');
const companyId = ref('');
const stageId = ref('');
const description = ref('');
const amount = ref('');
const currency = ref('USD');
const expectedCloseAt = ref('');
const personIds = ref<string[]>([]);
const pipelineName = ref('');
const pipelineStagesText = ref('New Opportunity\nQualified\nDiscovery\nProposal\nNegotiation\nWon\nLost');
const { notifySuccess, notifyError, errorText } = useSnackbar();
const busy = computed(() => saveMutation.loading.value || moveMutation.loading.value || deleteMutation.loading.value);

function openDeal(deal?: Deal) {
  editingDeal.value = deal ?? null;
  title.value = deal?.title ?? '';
  companyId.value = deal?.companyId ?? '';
  stageId.value = deal?.stageId ?? activePipeline.value?.stages.find((stage) => stage.category === 'open')?.id ?? '';
  description.value = deal?.description ?? '';
  amount.value = deal?.amount ?? '';
  currency.value = deal?.currency ?? 'USD';
  expectedCloseAt.value = deal?.expectedCloseAt?.slice(0, 10) ?? '';
  personIds.value = deal?.people.map((entry) => entry.personId) ?? [];
  dealDialog.value = true;
}

async function saveDeal() {
  if (!title.value.trim() || !companyId.value || !stageId.value || !activePipeline.value) return;
  const isEdit = !!editingDeal.value;
  try {
    await saveMutation.mutate({ variables: { input: {
    ...(editingDeal.value ? { id: editingDeal.value.id } : {}),
    title: title.value.trim(), companyId: companyId.value, pipelineId: activePipeline.value.id,
    stageId: stageId.value, description: description.value || undefined,
    amount: amount.value || undefined, currency: currency.value.trim().toUpperCase(),
    expectedCloseAt: expectedCloseAt.value ? new Date(`${expectedCloseAt.value}T12:00:00.000Z`).toISOString() : undefined,
    personIds: personIds.value,
    } } });
    dealDialog.value = false;
    notifySuccess(isEdit ? 'Deal updated.' : 'Deal created.');
    await query.refetch();
  } catch (error) {
    notifyError(errorText(error, 'Could not save deal.'));
  }
}

async function moveDeal(deal: Deal, targetStageId: string) {
  if (deal.stageId === targetStageId) return;
  try {
    await moveMutation.mutate({ variables: { dealId: deal.id, stageId: targetStageId } });
    await query.refetch();
  } catch (error) {
    notifyError(errorText(error, 'Could not move deal.'));
  }
}

const { confirmAction } = useConfirmDialog();

async function removeDeal(deal: Deal) {
  if (!await confirmAction({ title: `Delete “${deal.title}”?`, message: 'This deal will be permanently deleted.', confirmText: 'Delete' })) return;
  try {
    await deleteMutation.mutate({ variables: { dealId: deal.id } });
    notifySuccess('Deal deleted.');
    await query.refetch();
  } catch (error) {
    notifyError(errorText(error, 'Could not delete deal.'));
  }
}

async function createPipeline() {
  const stages = pipelineStagesText.value.split('\n').map((stage) => stage.trim()).filter(Boolean);
  try {
    const result = await pipelineMutation.mutate({ variables: { name: pipelineName.value.trim(), stages } });
    const created = result?.data?.createSalesPipeline;
    await query.refetch();
    if (created) selectedPipelineId.value = created.id;
    pipelineDialog.value = false;
    pipelineName.value = '';
    notifySuccess('Pipeline created.');
  } catch (error) {
    notifyError(errorText(error, 'Could not create pipeline.'));
  }
}

async function deletePipeline() {
  const pipeline = activePipeline.value;
  if (!pipeline || pipeline.isDefault) return;
  if (deals.value.length > 0) {
    notifyError('Move or delete all deals in this pipeline before deleting it.');
    return;
  }
  if (!await confirmAction({ title: `Delete pipeline “${pipeline.name}”?`, message: 'This pipeline and its stages will be permanently deleted.', confirmText: 'Delete' })) return;
  try {
    await pipelineDeleteMutation.mutate({ variables: { pipelineId: pipeline.id } });
    selectedPipelineId.value = '';
    notifySuccess('Pipeline deleted.');
    await query.refetch();
  } catch (error) {
    notifyError(errorText(error, 'Could not delete pipeline.'));
  }
}

function personName(person: Person) {
  return [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Unnamed person';
}

function formatAmount(deal: Deal) {
  if (deal.amount == null) return 'Amount not set';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: deal.currency }).format(Number(deal.amount));
}

function dragDeal(event: DragEvent, deal: Deal) { event.dataTransfer?.setData('text/deal-id', deal.id); }
async function dropDeal(event: DragEvent, stage: Stage) {
  event.preventDefault();
  const id = event.dataTransfer?.getData('text/deal-id');
  const deal = deals.value.find((item) => item.id === id);
  if (deal) await moveDeal(deal, stage.id);
}
</script>

<template>
  <v-container fluid>
    <CrmPageHeading eyebrow="REVENUE" title="Deals" description="Track revenue opportunities by company, people involved, and pipeline stage." />
    <v-alert v-if="query.error.value" type="error" variant="tonal" class="mb-4">
      Could not load deals: {{ query.error.value.message }} <v-btn size="small" variant="text" @click="query.refetch()">Retry</v-btn>
    </v-alert>
    <v-skeleton-loader v-else-if="query.loading.value" type="card, card, card" />
    <template v-else>
      <div class="d-flex align-center ga-3 mb-5 flex-wrap">
        <v-select v-model="selectedPipelineId" :items="pipelines" item-title="name" item-value="id" label="Pipeline" density="compact" variant="outlined" hide-details class="pipeline-select" />
        <v-btn prepend-icon="mdi-plus" variant="outlined" @click="pipelineDialog = true">New pipeline</v-btn>
        <v-tooltip v-if="activePipeline && !activePipeline.isDefault" text="Move or delete all deals in this pipeline to enable deletion." :disabled="deals.length === 0">
          <template #activator="{ props }">
            <span v-bind="props" class="d-inline-flex">
              <v-btn prepend-icon="mdi-delete-outline" variant="text" color="error" :disabled="deals.length > 0" :loading="pipelineDeleteMutation.loading.value" @click="deletePipeline">Delete pipeline</v-btn>
            </span>
          </template>
        </v-tooltip>
        <v-spacer />
        <v-btn color="primary" prepend-icon="mdi-plus" :disabled="!activePipeline || !companies.length" @click="openDeal()">New deal</v-btn>
      </div>
      <v-alert v-if="!companies.length" type="info" variant="tonal" class="mb-4">Save a company from LinkedIn before creating a deal.</v-alert>
      <div v-if="activePipeline" class="deal-board">
        <section v-for="stage in activePipeline.stages" :key="stage.id" class="deal-column" @dragover.prevent @drop="dropDeal($event, stage)">
          <header class="d-flex align-center justify-space-between pa-3">
            <span class="font-weight-medium">{{ stage.name }}</span>
            <v-chip size="x-small" variant="tonal">{{ deals.filter((deal) => deal.stageId === stage.id).length }}</v-chip>
          </header>
          <div class="deal-column-body">
            <v-card v-for="deal in deals.filter((item) => item.stageId === stage.id)" :key="deal.id" class="deal-card mb-3" rounded="lg" elevation="0" border draggable="true" @dragstart="dragDeal($event, deal)">
              <v-card-text class="pa-3">
                <div class="d-flex align-start justify-space-between ga-2">
                  <button class="deal-title text-left" @click="openDeal(deal)">{{ deal.title }}</button>
                  <v-menu>
                    <template #activator="{ props }"><v-btn v-bind="props" icon="mdi-dots-horizontal" size="x-small" variant="text" aria-label="Deal actions" /></template>
                    <v-list density="compact"><v-list-item title="Edit deal" prepend-icon="mdi-pencil" @click="openDeal(deal)" /><v-list-item title="Delete deal" prepend-icon="mdi-delete-outline" @click="removeDeal(deal)" /></v-list>
                  </v-menu>
                </div>
                <div class="text-body-2 mt-2"><v-icon icon="mdi-domain" size="small" class="mr-1" />{{ deal.company.name }}</div>
                <div class="text-body-2 mt-2">{{ formatAmount(deal) }}</div>
                <div v-if="deal.people.length" class="text-caption text-medium-emphasis mt-2">
                  <v-icon icon="mdi-account-multiple-outline" size="small" class="mr-1" />{{ deal.people.map(({ person }) => personName(person)).join(', ') }}
                </div>
                <div v-if="deal.expectedCloseAt" class="text-caption text-medium-emphasis mt-2">Expected {{ new Date(deal.expectedCloseAt).toLocaleDateString() }}</div>
                <v-select :model-value="deal.stageId" :items="activePipeline.stages" item-title="name" item-value="id" label="Move to stage" density="compact" variant="plain" hide-details class="mt-2" :disabled="busy" @update:model-value="moveDeal(deal, $event)" />
              </v-card-text>
            </v-card>
            <div v-if="!deals.some((deal) => deal.stageId === stage.id)" class="empty-stage">Drop a deal here</div>
          </div>
        </section>
      </div>
    </template>

    <v-dialog v-model="dealDialog" max-width="680">
      <v-card :title="editingDeal ? 'Edit deal' : 'New deal'">
        <v-card-text>
          <v-text-field v-model="title" label="Deal name" variant="outlined" class="mb-2" />
          <v-select v-model="companyId" :items="companies" item-title="name" item-value="id" label="Company" variant="outlined" class="mb-2" />
          <v-select v-model="personIds" :items="people" :item-title="personName" item-value="id" label="People involved" multiple chips closable-chips variant="outlined" class="mb-2" />
          <v-select v-model="stageId" :items="activePipeline?.stages" item-title="name" item-value="id" label="Pipeline stage" variant="outlined" class="mb-2" />
          <div class="d-flex ga-3">
            <v-text-field v-model="amount" label="Amount" type="number" min="0" step="0.01" variant="outlined" />
            <v-text-field v-model="currency" label="Currency" maxlength="3" variant="outlined" />
            <v-text-field v-model="expectedCloseAt" label="Expected close" type="date" variant="outlined" />
          </div>
          <v-textarea v-model="description" label="Notes" rows="3" variant="outlined" />
        </v-card-text>
        <v-card-actions><v-spacer /><v-btn variant="text" @click="dealDialog = false">Cancel</v-btn><v-btn color="primary" :loading="saveMutation.loading.value" :disabled="!title.trim() || !companyId || !stageId" @click="saveDeal">Save deal</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="pipelineDialog" max-width="560">
      <v-card title="Create pipeline">
        <v-card-text>
          <v-text-field v-model="pipelineName" label="Pipeline name" variant="outlined" class="mb-2" />
          <v-textarea v-model="pipelineStagesText" label="Stages, one per line" rows="8" hint="Include stages named Won and Lost for terminal outcomes." persistent-hint variant="outlined" />
        </v-card-text>
        <v-card-actions><v-spacer /><v-btn variant="text" @click="pipelineDialog = false">Cancel</v-btn><v-btn color="primary" :loading="pipelineMutation.loading.value" :disabled="!pipelineName.trim()" @click="createPipeline">Create pipeline</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.pipeline-select { max-width: 280px; }
.deal-board { display: grid; grid-auto-columns: minmax(255px, 1fr); grid-auto-flow: column; gap: 14px; overflow-x: auto; align-items: start; padding-bottom: 12px; }
.deal-column { min-height: 300px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 14px; background: rgba(var(--v-theme-surface), .55); }
.deal-column-body { padding: 0 10px 10px; min-height: 245px; }
.deal-card { background: rgb(var(--v-theme-surface)); cursor: grab; }
.deal-title { color: rgb(var(--v-theme-on-surface)); font-weight: 600; line-height: 1.35; }
.empty-stage { border: 1px dashed rgba(var(--v-border-color), .6); border-radius: 10px; padding: 18px 8px; text-align: center; color: rgba(var(--v-theme-on-surface), .55); font-size: .8rem; }
</style>
