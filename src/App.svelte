<script>
	import Home from './Home.svelte';
	import Header from './Header.svelte';
	import AboutMe from './AboutMe.svelte';
	import Experience from './Experience.svelte';
    import Education from './Education.svelte';
	import Project from './Project.svelte';
	import Footer from './Footer.svelte';
	import Skills from './Skills.svelte';
	import Contact from './Contact.svelte';
</script>

<main>
	<Header></Header>
	<Home></Home>
	<AboutMe></AboutMe>
	<Experience></Experience>
	<Education></Education>
	<Project></Project>
	<Skills></Skills>
	<Contact></Contact>
	<Footer></Footer>
</main>

<style type="text/scss">
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
		color: #6b686b;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>