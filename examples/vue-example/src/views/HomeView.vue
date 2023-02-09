<script setup lang="ts">
import { useConnect } from '@vue-ethereum-hooks/hooks';
import TheWelcome from '../components/TheWelcome.vue'
const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
</script>

<template>
  <main>
    <div :style="{display: 'flex', flexDirection: 'column'}">
      <button
        v-for="connector in connectors"
        :disabled="!connector.ready"
        :key="connector.id"
        @click="() => connect({ connector })"
      >
        <p v-if="connector.name">{{ connector.name }}</p>
        <p v-if="!connector.ready">{{ ' (unsupported)' }}</p>
        <p v-if="isLoading && (pendingConnector?.id === connector.id)">{{ ' (connecting)' }}</p>
      </button>
      <div>{{error?.message}}</div>
    </div>
  </main>
</template>
