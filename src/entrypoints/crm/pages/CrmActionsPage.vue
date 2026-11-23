<script setup lang="ts">
import { computed } from 'vue';
import CrmPageNavBar from '@/components/crm/CrmPageNavBar.vue';

type ActionIdea = { title: string; description: string; when: string };
type ActionGroup = { title: string; icon: string; actions: ActionIdea[] };
const groups: ActionGroup[] = [
  { title: 'Direct outreach', icon: 'mdi-reply-outline', actions: [
    { title: 'Reply to a waiting message', description: 'Review the conversation and send a thoughtful reply.', when: 'An incoming message needs a response.' },
    { title: 'Send a contextual follow-up', description: 'Reach out with a useful update, resource, or question.', when: 'A conversation has gone quiet.' },
    { title: 'Congratulate on a milestone', description: 'Send a brief, personal note about a new role or achievement.', when: 'A contact has a career or company milestone.' },
    { title: 'Fulfill a promise', description: 'Send the introduction, resource, or update you committed to.', when: 'You have an open commitment.' },
  ]},
  { title: 'Relationship & network', icon: 'mdi-account-multiple-plus-outline', actions: [
    { title: 'Request a warm introduction', description: 'Ask a mutual contact to connect you with a relevant person.', when: 'A trusted introduction path is available.' },
    { title: 'Invite to coffee or an event', description: 'Suggest a low-pressure meetup or relevant event.', when: 'You will be near a contact or hosting an event.' },
    { title: 'Offer a useful introduction', description: 'Connect two people who may benefit from knowing each other.', when: 'There is a clear mutual benefit.' },
    { title: 'Ask for advice or feedback', description: 'Start a focused conversation around a specific challenge.', when: 'A senior peer or advisor could offer perspective.' },
  ]},
  { title: 'Pipeline & business', icon: 'mdi-briefcase-outline', actions: [
    { title: 'Propose a catch-up call', description: 'Suggest a short call to explore a relevant opportunity.', when: 'A conversation shows renewed interest.' },
    { title: 'Share a relevant resource', description: 'Send a case study, article, or example matched to their context.', when: 'A contact has a new role, challenge, or priority.' },
    { title: 'Reconnect with a past client', description: 'Check in on results and explore what would be useful next.', when: 'A past engagement has wrapped up.' },
  ]},
  { title: 'Relationship hygiene', icon: 'mdi-tune-variant', actions: [
    { title: 'Review a relationship priority', description: 'Decide whether this contact belongs in a higher-priority segment.', when: 'A relationship becomes more or less important.' },
    { title: 'Capture offline context', description: 'Record notes from a call, conference, or in-person meeting.', when: 'Useful context happened outside the CRM.' },
    { title: 'Revisit this action later', description: 'Create a task with a due date that fits the right follow-up timing.', when: 'The next step matters, but not today.' },
  ]},
];
const totalActions = computed(() => groups.reduce((total, group) => total + group.actions.length, 0));
</script>

<template>
  <CrmPageNavBar
    title="Actions"
    description="Choose a useful next step and add it to Tasks when you are ready"
  >
    <template #append>
      <v-btn variant="tonal" prepend-icon="mdi-radar" to="/actions/signals" class="mr-4">Configure signals</v-btn>
    </template>
  </CrmPageNavBar>

  <v-container>
    <v-card rounded="xl" elevation="0" border class="mb-6">
      <v-card-item><v-card-title>Triggered actions</v-card-title><v-card-subtitle>Recommended next steps created when a selected signal is detected.</v-card-subtitle></v-card-item>
      <v-divider />
      <v-card-text class="d-flex flex-column align-center text-center py-8">
        <v-avatar color="primary" variant="tonal" size="48" class="mb-3"><v-icon icon="mdi-radar" /></v-avatar>
        <div class="text-subtitle-1 font-weight-medium">No triggered actions yet</div>
        <div class="text-body-2 text-medium-emphasis mt-1" style="max-width: 520px">
          When monitoring detects a selected signal, its related recommendation will appear here. You’ll be able to turn it into a task.
        </div>

        <div class="d-flex justify-center ga-2 mt-4">
          <v-btn variant="tonal" color="primary" prepend-icon="mdi-radar" to="/actions/signals">Choose signals to monitor</v-btn>
          <v-btn variant="text" color="primary" prepend-icon="mdi-check-circle-outline" to="/tasks">View tasks</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <div class="mt-4">
      <h3 class="text-body-large mb-3">Categorized actions</h3>
    </div>

    <v-row>
      <v-col v-for="group in groups" :key="group.title" cols="12" xl="6">
        <v-card rounded="xl" elevation="0" border class="h-100">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" variant="tonal" rounded="lg">
                <v-icon :icon="group.icon" />
              </v-avatar>
            </template>
            <v-card-title>{{ group.title }}</v-card-title>
          </v-card-item>
          <v-divider />
          <v-list lines="two" class="py-0">
            <v-list-item v-for="action in group.actions" :key="action.title" class="py-2">
              <v-list-item-title class="text-body-2 font-weight-medium">{{ action.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-wrap mt-1">{{ action.description }}<br><span class="text-caption">Useful when: {{ action.when }}</span></v-list-item-subtitle>
              <template #append>
                <v-chip size="small" variant="tonal" color="default">0</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
