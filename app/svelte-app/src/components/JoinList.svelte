<script>
  export let onClose;
  export let onSuccess;
  const apiKey = import.meta.env.VITE_KEY;

  let shareKey = '';
  let isLoading = false;
  let errorMessage = '';

  const handleSubmit = async () => {
    if (!shareKey) return;
    isLoading = true;
    errorMessage = '';
    
    try {
      const response = await fetch(`http://localhost:3000/api/v1/lists/${shareKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('List not found');
      const data = await response.json();
      
      if (data?.list?.shareKey) {
        onSuccess(data.list.shareKey);
      }
    } catch (err) {
      errorMessage = 'Invalid share key or network error';
      console.error(err);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="modal-overlay">
  <div class="modal">
    <div class="header">
      <h3>Join Existing List</h3>
      <button class="close-btn" onclick={onClose}>×</button>
    </div>
    <input
      class="key-input"
      type="text"
      bind:value={shareKey}
      placeholder="Enter Share Key"
      disabled={isLoading}
    />
    <button onclick={handleSubmit} disabled={isLoading}>
      {isLoading ? 'Joining...' : 'Submit'}
    </button>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    display: flex;
    flex-direction: column;
    background: white;
    padding: 0 3rem 3rem 3rem;
    border-radius: 8px;
    border: none;
  }
  .key-input {
    margin-top: 3rem;
    margin-bottom: 1rem;
    height: 3rem;
    border-radius: 10px;
  }
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
  } 
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
</style>