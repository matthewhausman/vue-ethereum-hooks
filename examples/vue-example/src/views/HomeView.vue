<script setup lang="ts">
import { useConnect } from '@vue-ethereum-hooks/hooks';
import { useBlockNumber } from '@vue-ethereum-hooks/hooks';
import { watch } from 'vue'
const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

const b = useBlockNumber({
  watch: true
})

</script>

<template>
  <main :style="{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}">
    <div :style="{display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '400px'}">
      <button
        v-for="connector in connectors"
        :disabled="!connector.ready"
        :key="connector.id"
        :style="{
          background: '#333',
          border: '1px solid grey',
          padding: '8px',
          borderRadius: '4px',
          cursor: 'pointer',
          color: 'white'
        }"
        @click="() => connect({ connector })"
      >
        <p v-if="connector.name">{{ connector.name }}</p>
        <p v-if="!connector.ready">{{ ' (unsupported)' }}</p>
        <p v-if="isLoading && (pendingConnector?.id === connector.id)">{{ ' (connecting)' }}</p>
      </button>
    </div>
    <div :style="{marginTop: '10px'}">{{error?.message}}</div>
    <p>{{ b.data.value?.toString() }}</p>
  </main>
</template>
