<script>
  import viteLogo from '/vite.svg'
  import Counter from './components/Counter.svelte'
  import Loader from './components/common/Loader.svelte'
  import ListView from './components/ListView.svelte'
  import {
    onMount
  } from 'svelte';
  let message = '';

  const apiKey =
    import.meta.env.VITE_KEY;

  // Is user Created and logged in?
  // Is User part of a Todo List?
  let userId = undefined;
  let listId = undefined;
  let res;

  onMount(async () => {
    // Retrieve stored data using the exposed API
    // @ts-ignore
    userId = await window.storeAPI.get('userId');
    // @ts-ignore
    listId = await window.storeAPI.get('listId');

    if (!userId) {
      // create a user. store the response in electron-store
      try {
        const response = await fetch('http://localhost:3000/api/v1/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        const newUserId = data?.user?.id ?? null;
        if (!newUserId) {
          throw new Error("No user created");
        }

        // @ts-ignore
        await window.storeAPI.set('userId', newUserId);
        userId = data.user.userId;
        message = 'User created successfully';
      } catch (error) {
        message = 'Error creating user';
        console.error(error);
      }
    }
  });
</script>

{#if userId === undefined }
<div>
  {message}
  <Loader message="Loading Poolside" />
</div>
{:else if (!!userId && !!listId) }
<ListView />
{:else}
<div>
    <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} class="logo" alt="Vite Logo" />
        </a>
    </div>
    <h1>Poolside List</h1>

    <div class="card">
        <p>message: {message || userId}</p>
        <p>{res}</p>
        <Counter />
    </div>

    <p>
        Todo lists for the Rest of Us
    </p>

    <p class="read-the-docs">
        Built in Australia
    </p>
</div>
{/if}

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }

  .read-the-docs {
    color: #888;
  }
</style>
