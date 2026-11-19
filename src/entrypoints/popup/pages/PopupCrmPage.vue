<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth';

const { user } = useAuth();
</script>

<template>
  <div class="crm-content">
    <p>You're logged in as <b>{{ user?.email }}</b>.</p>
    <p>Go to your CRM workspace to manage saved leads, accounts, and activity.</p>
  </div>
</template>
