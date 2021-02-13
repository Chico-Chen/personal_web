<script>
	import { onMount } from 'svelte'
	export let interval = 30
	export let loop = false
	export let cursor = true

	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
	const rng = (min, max) => Math.floor(Math.random() * (max - min) + min)
	const typingInterval = async () =>
		Array.isArray(interval) ? await sleep(interval[rng(0, interval.length)]) : await sleep(interval)

	const typewriterEffect = async el => {
		const elText = el.textContent.split('')
		el.textContent = ''
		el.classList.add('typing')
		for (const letter of elText) {
			el.textContent += letter
			const fullyWritten = el.textContent === elText.join('')
			if (fullyWritten) {
				typeof loop === 'number' ? await sleep(loop) : await sleep(1500)
				while (el.textContent !== '') {
					el.textContent = el.textContent.slice(0, -1)
					await typingInterval()
				}
				return
			}
			await typingInterval()
		}
		if (el.nextSibling !== null) el.classList.remove('typing')
	}

	let node

	onMount(async () => {
		const elements = [...node.children].map(el => el.textContent.split(''))
		const loopParagraphTag = node.firstChild.tagName.toLowerCase()
		const loopParagraph = document.createElement(loopParagraphTag)
		node.childNodes.forEach(el => el.remove())
		node.appendChild(loopParagraph)
		const loop = async () => {
			for (const text of elements) {
				loopParagraph.textContent = text.join('')
				await typewriterEffect(loopParagraph)
			}
			loop()
		}
		loop()
	})
</script>

<style>
	@keyframes cursorFade {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

    .font {
        font-size: 1.5rem;
        color: black;
        font-family: Bradley Hand, cursive;
    }

	.cursor :global(.typing::after) {
		content: '|';
		color: var(--cursor-color);
		animation: cursorFade 1.25s infinite;
        font-size: 2.5rem;
        color: black;
        font-family: Bradley Hand, cursive;
	}
</style>

<div class="font" class:cursor style="--cursor-color: {typeof cursor === 'string' ? cursor : 'black'}" bind:this={node}>
	<slot />
</div>