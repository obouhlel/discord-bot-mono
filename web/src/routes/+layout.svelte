<script lang="ts">
	import '$lib/assets/css/app.css';
	import favicon from '$lib/assets/img/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Kohana - Discord Bot</title>
	<meta name="description" content="Kohana bot discord website" />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="w-full min-h-screen flex flex-col">
  <header class="w-full h-12 px-2 py-3 mb-2 flex justify-between">
    <a href="/" class="text-xl font-bold">Kohana</a>
  </header>

	<main class="flex-1">
		{@render children?.()}
	</main>

	<footer class="w-full">
    <p class="w-full mt-2 text-center">
      Made by oustoky with <span class="text-red-500 font-bold">♥</span>
    </p>
  </footer>
</div>
