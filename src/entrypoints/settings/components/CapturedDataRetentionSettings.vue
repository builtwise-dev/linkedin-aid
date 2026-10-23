<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useDataStore } from '@/store/data-store';
import { storageService } from '@/services/storage-service';

const { capturedEntitiesTTL } = useDataStore();
const selectedTTL = ref(30);

watch(() => capturedEntitiesTTL.value, (value) => {
  selectedTTL.value = value;
}, { immediate: true });

watch(selectedTTL, async (value) => {
  await storageService.setLocal({ capturedEntitiesTTL: value });
});

const options = [
  { title: '7 days', value: 7 },
  { title: '30 days', value: 30 },
  { title: '90 days', value: 90 },
  { title: '180 days', value: 180 },
  { title: '1 year', value: 365 },
  { title: 'Never', value: -1 },
];

const retentionDescription = computed(() => selectedTTL.value === -1
  ? 'Captured data will be kept until you remove it.'
  : `Captured leads, companies, and search sessions older than ${selectedTTL.value} days are automatically removed.`);
</script>

<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-text class="retention-content">
      <div class="retention-copy">
        <div class="d-flex align-center ga-2 mb-1">
          <v-icon icon="mdi-database-clock-outline" color="#0073b1" />
          <div class="text-subtitle-1 font-weight-medium">Data retention</div>
        </div>
        <div class="text-body-2 text-medium-emphasis" aria-live="polite">
          {{ retentionDescription }}
        </div>
      </div>

      <v-select
        v-model="selectedTTL"
        :items="options"
        item-title="title"
        item-value="value"
        label="Keep data for"
        variant="outlined"
        density="comfortable"
        hide-details
        class="retention-select"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.retention-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.retention-copy {
  flex: 1;
  min-width: 220px;
}

.retention-select {
  flex: 0 1 220px;
  min-width: 180px;
}

@media (max-width: 600px) {
  .retention-content {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }

  .retention-select {
    flex: auto;
    width: 100%;
  }
}
</style>
