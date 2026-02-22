<script setup lang="ts">
  import { ref } from 'vue'
  import BaseCard from '@/components/common/BaseCard.vue'
  import BaseButton from '@/components/common/BaseButton.vue'

  const selectedTool = ref<string>('select')

  const tools = [
    { id: 'select', label: 'Sélectionner', icon: '🖱️' },
    { id: 'table-round', label: 'Table ronde', icon: '⭕' },
    { id: 'table-square', label: 'Table carrée', icon: '⬜' },
    { id: 'table-rect', label: 'Table rectangulaire', icon: '▭' },
    { id: 'chair', label: 'Chaise', icon: '🪑' },
    { id: 'wall', label: 'Mur', icon: '🧱' },
    { id: 'bar', label: 'Bar', icon: '🍸' },
    { id: 'kitchen', label: 'Cuisine', icon: '👨‍🍳' },
  ]
</script>

<template>
  <div class="floor-plan-editor">
    <header class="editor-header">
      <h1>Éditeur de plan de salle</h1>
      <div class="header-actions">
        <BaseButton variant="outline">Annuler</BaseButton>
        <BaseButton variant="primary">Enregistrer</BaseButton>
      </div>
    </header>

    <div class="editor-layout">
      <aside class="toolbar">
        <BaseCard>
          <h3>Outils</h3>
          <div class="tools-list">
            <button
              v-for="tool in tools"
              :key="tool.id"
              :class="['tool-btn', { active: selectedTool === tool.id }]"
              :title="tool.label"
              @click="selectedTool = tool.id"
            >
              <span class="tool-icon">{{ tool.icon }}</span>
              <span class="tool-label">{{ tool.label }}</span>
            </button>
          </div>
        </BaseCard>

        <BaseCard>
          <h3>Propriétés</h3>
          <p class="placeholder">Sélectionnez un élément pour modifier ses propriétés.</p>
        </BaseCard>
      </aside>

      <main class="canvas-area">
        <div class="canvas">
          <p class="canvas-placeholder">
            Cliquez et faites glisser pour placer des éléments sur la grille.<br />
            L'éditeur de plan de salle sera implémenté ici.
          </p>
        </div>
      </main>

      <aside class="elements-panel">
        <BaseCard>
          <h3>Éléments</h3>
          <p class="placeholder">Liste des tables et éléments placés sur le plan.</p>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<style scoped>
  .floor-plan-editor {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
    min-height: 600px;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .editor-header h1 {
    color: var(--color-primary);
    margin-bottom: 0;
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .editor-layout {
    display: grid;
    grid-template-columns: 220px 1fr 250px;
    gap: var(--spacing-md);
    flex: 1;
    min-height: 0;
  }

  @media (max-width: 1200px) {
    .editor-layout {
      grid-template-columns: 180px 1fr;
    }

    .elements-panel {
      display: none;
    }
  }

  .toolbar,
  .elements-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    overflow-y: auto;
  }

  h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .tool-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: none;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .tool-btn:hover {
    background-color: var(--color-background-soft);
  }

  .tool-btn.active {
    background-color: var(--color-primary);
    color: white;
  }

  .tool-icon {
    font-size: 1.25rem;
  }

  .tool-label {
    font-size: 0.875rem;
  }

  .canvas-area {
    background-color: var(--color-background-soft);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }

  .canvas {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(var(--color-border-light) 1px, transparent 1px),
      linear-gradient(90deg, var(--color-border-light) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .canvas-placeholder {
    text-align: center;
    color: var(--color-text-muted);
    padding: var(--spacing-xl);
  }

  .placeholder {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-bottom: 0;
  }
</style>
