<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import SignInView from '@/components/common/views/SignInView.vue';
import CrmNavigationDrawer from '@/components/crm/CrmNavigationDrawer.vue';
import CrmAppBar from '@/components/crm/CrmAppBar.vue';

const { user, loading } = useAuth();
</script>

<template>
  <v-app class="crm-app">
    <v-container v-if="loading" class="crm-loading" fluid><v-progress-circular indeterminate color="primary" /></v-container>
    <SignInView v-else-if="!user" />
    <template v-else>
      <CrmNavigationDrawer :user="user" />
      <v-main>
        <CrmAppBar />
        <v-container class="crm-content" fluid>
          <router-view />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<style>
.crm-app { background: #f6f8fb; color: #172b4d; }
.crm-content { max-width: 1440px; padding: 36px 40px 56px; }
.crm-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; }

@media (max-width: 900px) {
  .crm-content {
    padding: 24px 20px 40px;
  }
}
</style>
