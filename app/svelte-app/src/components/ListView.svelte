<script>
	// In-memory state for the list of todos and new todo text
	let todos = [];
	let newTodoText = "";
	const user = "default";
  export let userId;
  export let listKey;

	// Returns an ISO timestamp for tracking when a todo is updated
	function getTimestamp() {
		return new Date().toISOString();
	}

	// Add a new todo if text is provided
	function addTodo() {
		if (newTodoText.trim() === "") return;
		const newTodo = {
			id: Date.now(), // Using timestamp as a simple unique ID
			text: newTodoText,
			state: "TODO",
			user,
			updatedAt: getTimestamp()
		};
		todos = [...todos, newTodo];
		newTodoText = "";
	}

	// Update a todo's state based on allowed transitions
	function updateTodoState(todoId, targetState) {
		todos = todos.map(todo => {
			if (todo.id === todoId) {
				const allowedTransitions = {
					"TODO": ["ONGOING"],
					"ONGOING": ["TODO", "DONE"],
					"DONE": ["ONGOING"]
				};
				if (allowedTransitions[todo.state].includes(targetState)) {
					return { ...todo, state: targetState, updatedAt: getTimestamp() };
				}
			}
			return todo;
		});
	}

	// Remove a todo from the list
	function deleteTodo(todoId) {
		todos = todos.filter(todo => todo.id !== todoId);
	}
</script>

<main>
	<h1>Simple Todo App</h1>

	<!-- Input to add a new todo -->
	<input
		type="text"
		bind:value={newTodoText}
		placeholder="Enter a new todo"
	/>
	<button on:click={addTodo}>Add Todo</button>

	{#if todos.length === 0}
		<p>No todos available.</p>
	{/if}

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
						<button on:click={() => updateTodoState(todo.id, 'ONGOING')}>Start</button>
					{:else if todo.state === 'ONGOING'}
						<button on:click={() => updateTodoState(todo.id, 'DONE')}>Mark as Done</button>
						<button on:click={() => updateTodoState(todo.id, 'TODO')}>Revert to TODO</button>
					{:else if todo.state === 'DONE'}
						<button on:click={() => updateTodoState(todo.id, 'ONGOING')}>Reopen</button>
					{/if}
					<button on:click={() => deleteTodo(todo.id)}>Delete</button>
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
    color: black;
		width: 70%;
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
