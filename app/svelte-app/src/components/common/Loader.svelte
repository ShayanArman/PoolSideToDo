<script>
  export let message = "Loading...";
</script>

<div class="loader-container">
  <div class="spinner"></div>
  <p class="message">{message}</p>
</div>

<style>
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff7f00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .message {
    color: #666;
    font-size: 1.2rem;
    font-weight: 600;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>