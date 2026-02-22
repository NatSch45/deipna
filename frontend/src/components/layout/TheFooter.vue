<script setup lang="ts">
  const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Deipna</h4>
        <p>Application de planification et réservation de restaurants.</p>
      </div>

      <div class="footer-section">
        <h4>Liens utiles</h4>
        <ul>
          <li><a href="/restaurants">Rechercher un restaurant</a></li>
          <li><a href="/register">Créer un compte</a></li>
          <li><a href="#">Devenir partenaire</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:contact@deipna.com">contact@deipna.com</a></li>
          <li><a href="#">Aide & Support</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Deipna. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: var(--color-background-soft);
    border-top: 1px solid var(--color-border-light);
    margin-top: auto;
    padding: var(--spacing-2xl) 0 var(--spacing-lg);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
  }

  .footer-section h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .footer-section p {
    color: var(--color-text-light);
    margin-bottom: 0;
  }

  .footer-section ul {
    list-style: none;
  }

  .footer-section li {
    margin-bottom: var(--spacing-sm);
  }

  .footer-section a {
    color: var(--color-text-light);
    transition: color var(--transition-fast);
  }

  .footer-section a:hover {
    color: var(--color-primary);
  }

  .footer-bottom {
    max-width: 1200px;
    margin: var(--spacing-xl) auto 0;
    padding: var(--spacing-md) var(--spacing-md) 0;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  .footer-bottom p {
    color: var(--color-text-muted);
    margin-bottom: 0;
    font-size: 0.875rem;
  }
</style>
