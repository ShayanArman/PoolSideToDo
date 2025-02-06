<script>
  import viteLogo from '/vite.svg'
  import Loader from './components/common/Loader.svelte'
  import ListView from './components/ListView.svelte'
  import JoinList from './components/JoinList.svelte';

  import {
    onMount
  } from 'svelte';

  const apiKey = import.meta.env.VITE_KEY;
  let showJoinModal = false;
  let message = '';

  const joinList = () => {
    showJoinModal = true;
  };

  // Is user Created and logged in?
  // Is User part of a Todo List?
  let userId = undefined;
  let listKey = undefined;

  const handleJoinSuccess = async (newListKey) => {
    try {
      // @ts-ignore
      await window.storeAPI.set('listKey', newListKey);
      listKey = newListKey;
      message = 'List joined successfully';
      showJoinModal = false;
    } catch (error) {
      message = 'Error joining list';
      console.error(error);
    }
  };

  const createList = async () => {
    try {
      // create a function to call the backend and make a list
      const response = await fetch('http://localhost:3000/api/v1/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const newListKey = data?.list?.shareKey ?? null;
      if (!newListKey) {
        throw new Error("No list created");
      } 

      // @ts-ignore
      await window.storeAPI.set('listKey', newListKey);
      listKey = newListKey;
      message = 'List created successfully';
    } catch (error) {
      message = 'Error creating List';
      console.error(error);
    }
  }

  onMount(async () => {
    // Retrieve stored data using the exposed API
    // @ts-ignore
    userId = await window.storeAPI.get('userId');
    // @ts-ignore
    listKey = await window.storeAPI.get('listKey');

    // create a user. store the response in electron-store
    if (!userId) {
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
        userId = newUserId;
        message = 'User created successfully';
      } catch (error) {
        message = 'Error creating user';
        console.error(error);
      }
    }
  });
</script>

{#if userId === undefined }
  <Loader message="Loading Poolside" />
{:else if (!!userId && !!listKey) }
  <ListView userId={userId} listKey={listKey} />
{:else}
<div>
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
  </div>
  <h1>Poolside List</h1>

  <div class="card">
      {#if message}<p>message: {message}</p>{/if}
      <p>UserId: <span style="font-weight: bold;">{userId}</span></p>
      <button onclick={createList}>New List</button>
      <button onclick={joinList}>Join List</button>
  </div>

  <p>
    ToDo Lists for the Rest of Us
  </p>

  <p class="read-the-docs">
    Built in Australia
  </p>

  {#if showJoinModal}
    <JoinList 
      onClose={() => { showJoinModal = false}} 
      onSuccess={handleJoinSuccess}
    />
  {/if}
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
