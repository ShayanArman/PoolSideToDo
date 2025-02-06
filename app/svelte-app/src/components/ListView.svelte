<script>
	import { onMount } from 'svelte';
	const apiKey = import.meta.env.VITE_KEY;
	export let listKey;
	// In-memory state for the list of todos and new todo text
	let todos = [];
	let newTodoText = "";
	let message = '';
	let errorMessage = '';

	const updateTodoState = async (todoId, targetState) => {
		const todo = todos.find(t => t.id === todoId);
		if (!todo) return;

		const allowedTransitions = {
			"TODO": ["ONGOING"],
			"ONGOING": ["TODO", "DONE"],
			"DONE": ["ONGOING"]
		};
		if (!allowedTransitions[todo.state].includes(targetState)) {
			return;
		}

		try {
			const response = await fetch(`http://localhost:3000/api/v1/todos/${todoId}?listKey=${listKey}`, {
				method: 'PATCH',
				headers: {
						'Authorization': `Bearer ${apiKey}`,
						'Content-Type': 'application/json'
				},
				body: JSON.stringify({ state: targetState })
			});
			const data = await response.json();
			const updatedTodo = data?.todo ?? null;
			if (!updatedTodo) {
					throw new Error("No TODO updated");
			}
			todos = todos.map(t => t.id === todoId ? updatedTodo : t);
			message = 'Todo updated successfully';
		} catch (error) {
			message = 'Error updating TODO';
			console.error(error);
		}
	}

	const addTodo = async () => {
		if (!newTodoText) {
			return;
		}

		try {
			const response = await fetch(`http://localhost:3000/api/v1/todos?listKey=${listKey}&text=${newTodoText}`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				},
			});
			const data = await response.json();
			const newTodo = data?.todo ?? null;
			if (!newTodo) {
				throw new Error("No TODO created");
			} 

			todos = [...todos, newTodo];
			message = 'Todos created successfully';
		} catch (error) {
			message = 'Error creating TODO';
			console.error(error);
		}
	}

  onMount(async () => {
    // create a user. store the response in electron-store
    if (todos.length === 0) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/todos?listKey=${listKey}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        const newTodos = data?.todos ?? null;
        if (!newTodos) {
          throw new Error("No user created");
        }

        todos = newTodos;
        message = 'Todos successfuly found';
      } catch (error) {
        message = 'Error creating user';
        console.error(error);
      }
    }
  });
</script>

<main>
	<h1>Simple Todo App</h1>

	<div class="add-todo-container">
		<!-- Input to add a new todo -->
		<input
			type="text"
			bind:value={newTodoText}
			placeholder="Enter a new todo"
		/>

		<!-- Todo: add the todo function -->
		<button on:click={addTodo}>Add Todo</button>
	</div>

	<!-- Display the list of todos -->
	<ul>
		{#each todos as todo (todo.id)}
			<li class="todo-item">
				<div>
					<strong>{todo.text}</strong>
				</div>
				<div>
					State: {todo.state} | Last Updated: {new Date(todo.updatedAt).toLocaleString()}
				</div>
				<div class="actions">
					{#if todo.state === 'TODO'}
						<!-- Update the State. -->
						<button on:click={() => updateTodoState(todo.id, "ONGOING")}>Start</button>
					{:else if todo.state === 'ONGOING'}
					<button on:click={() => updateTodoState(todo.id, "DONE")}>Mark as Done</button>
					<button on:click={() => updateTodoState(todo.id, "TODO")}>Revert to TODO</button>
					{:else if todo.state === 'DONE'}
					<button on:click={() => updateTodoState(todo.id, "ONGOING")}>Reopen</button>
					{/if}
					<!-- Update delete TODO -->
					<button on:click={() => {}}>Delete</button>
				</div>
			</li>
		{/each}
	</ul>
</main>

<style>
  .main-container {
    display: flex;
    flex-direction: column;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }
	main {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: sans-serif;
	}
	input {
		padding: 0.5rem;
		font-size: 1rem;
		border-radius: 15px;
    color: black;
		width: 70%;
	}
	.add-todo-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		border-radius: 15px;
  	box-shadow: "0 2px 5px 0 rgba(50,50,93,.1),0 1px 1px 0 rgba(0,0,0,.07)";
	}
	button {
		padding: 0.5rem 1rem;
		margin-left: 0.5rem;
		font-size: 1rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	.todo-item {
		padding: 1rem;
		border-bottom: 1px solid #ccc;
		margin-top: 1rem;
	}
	.actions button {
		margin-right: 0.5rem;
	}
</style>
