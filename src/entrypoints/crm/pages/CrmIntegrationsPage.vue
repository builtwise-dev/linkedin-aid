<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import { cdnToolsUrl } from '@/constants/urls';

const integrations = [
  {
    name: 'Webhooks',
    category: 'Automation',
    description: 'Send CRM events to your own services and trigger workflows when records change.',
    icon: 'mdi-webhook',
    iconColor: '#7257c7',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'LinkedIn',
    category: 'Data capture',
    description: 'Capture leads, companies, and search results while you work in LinkedIn Sales Navigator.',
    icon: 'mdi-linkedin',
    iconColor: '#0a66c2',
    status: 'Connected',
    connected: true,
  },
  {
    name: 'Notion',
    category: 'Workspace',
    description: 'Send saved leads and company details to your Notion workspace.',
    logo: cdnToolsUrl('integrations/saas/notion.svg'),
    iconColor: '#222222',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'n8n',
    category: 'Automation',
    description: 'Build workflows that connect your CRM data to the services you use.',
    icon: 'mdi-lightning-bolt-outline',
    iconColor: '#ea4b71',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'CSV export',
    category: 'Data export',
    description: 'Export your saved leads and companies for use in spreadsheets and other tools.',
    icon: 'mdi-file-delimited-outline',
    iconColor: '#18864b',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Apollo',
    category: 'Sales intelligence',
    description: 'Enrich CRM records with contact and company details from Apollo.',
    icon: 'mdi-rocket-launch-outline',
    iconColor: '#6657d9',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Clarify',
    category: 'CRM',
    description: 'Sync your LinkedIn leads and company records with Clarify.',
    icon: 'mdi-account-box-multiple-outline',
    iconColor: '#5b7cfa',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Klipy.ai',
    category: 'Sales workspace',
    description: 'Bring your LinkedIn prospecting context into Klipy.ai.',
    icon: 'mdi-chart-box-outline',
    iconColor: '#5865f2',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Gmail',
    category: 'Email',
    description: 'Connect email conversations with your leads and company records.',
    icon: 'mdi-gmail',
    iconColor: '#ea4335',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Google Calendar',
    category: 'Calendar',
    description: 'Keep meetings and follow-ups alongside your CRM activity.',
    icon: 'mdi-calendar-month-outline',
    iconColor: '#4285f4',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Calendly',
    category: 'Scheduling',
    description: 'Bring scheduled prospect meetings into your CRM workflow.',
    icon: 'mdi-calendar-clock-outline',
    iconColor: '#006bff',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Attio',
    category: 'CRM',
    description: 'Sync people and company records with your Attio workspace.',
    icon: 'mdi-view-grid-outline',
    iconColor: '#5b5bd6',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Cal.com',
    category: 'Scheduling',
    description: 'Bring booked meetings and scheduling activity into your CRM.',
    icon: 'mdi-calendar-check-outline',
    iconColor: '#292929',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Google Meet',
    category: 'Video meetings',
    description: 'Keep video meeting details close to your prospect records.',
    icon: 'mdi-video-outline',
    iconColor: '#34a853',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Microsoft Teams',
    category: 'Video meetings',
    description: 'Connect Teams meetings and collaboration with CRM activity.',
    icon: 'mdi-microsoft-teams',
    iconColor: '#6264a7',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Zoom',
    category: 'Video meetings',
    description: 'Keep Zoom meeting activity connected to your prospect records.',
    icon: 'mdi-video-outline',
    iconColor: '#2d8cff',
    status: 'Coming soon',
    connected: false,
  },
  {
    name: 'Slack',
    category: 'Team communication',
    description: 'Share CRM updates and prospect activity with your team in Slack.',
    icon: 'mdi-slack',
    iconColor: '#611f69',
    status: 'Coming soon',
    connected: false,
  },
];
</script>

<template>
  <v-container>
    <CrmPageHeading
      eyebrow="WORKSPACE TOOLS"
      title="Integrations"
      description="Connect your CRM workflow with the tools you use every day."
    />

    <div class="integration-grid">
      <v-card v-for="integration in integrations" :key="integration.name" class="integration-card" rounded="xl" elevation="0">
        <v-card-text class="integration-card-content">
          <div class="d-flex align-start justify-space-between ga-3 mb-4">
            <v-avatar size="38" rounded="lg" class="integration-icon" :style="{ color: integration.iconColor }">
              <v-img v-if="'logo' in integration" :src="integration.logo" :alt="`${integration.name} logo`" class="brand-logo" />
              <v-icon v-else :icon="integration.icon" size="21" />
            </v-avatar>
            <v-chip
              size="small"
              :color="integration.connected ? 'success' : undefined"
              :variant="integration.connected ? 'tonal' : 'outlined'"
              class="status-chip"
            >
              <v-icon v-if="integration.connected" start icon="mdi-check-circle" size="15" />
              {{ integration.status }}
            </v-chip>
          </div>

          <div class="text-caption text-medium-emphasis text-uppercase font-weight-medium mb-1">{{ integration.category }}</div>
          <h2 class="text-subtitle-1 font-weight-bold mb-1">{{ integration.name }}</h2>
          <p class="integration-description">{{ integration.description }}</p>
        </v-card-text>
      </v-card>
    </div>

    <v-card class="integration-note mt-6" rounded="xl" variant="tonal" color="primary">
      <v-card-text class="d-flex align-start ga-3 pa-5">
        <v-icon icon="mdi-information-outline" class="mt-1" />
        <div>
          <div class="font-weight-bold mb-1">How LinkedIn connects</div>
          <div class="text-body-2 text-medium-emphasis">
            LinkedIn data is captured by the browser extension when you use Sales Navigator. Sign in with your account and
            open LinkedIn to start saving records to this CRM.
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
  gap: 12px;
}

.integration-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

.integration-icon {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.brand-logo {
  max-width: 24px;
  height: 24px;
}

.integration-card-content {
  padding: 18px;
}

.integration-description {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.75rem;
  line-height: 1.45;
  min-height: 54px;
  margin: 0;
}

.status-chip {
  font-weight: 600;
}

@media (min-width: 1200px) {
  .integration-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1600px) {
  .integration-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .integration-card-content {
    padding: 16px;
  }

  .integration-description {
    min-height: 0;
  }
}
</style>
