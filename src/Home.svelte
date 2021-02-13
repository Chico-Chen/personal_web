<script>
    import Typewriter from './Typewriter.svelte';
</script>

<section class="home_background"  id="home">
    <div class="container">
        <div class="content">
            <h1>Hello, I'm Chico Chen</h1>
            <Typewriter loop={true} interval={100}>
                <h2 class='h2'>A Software Developer</h2>
            </Typewriter>
            <!-- <h2>A Software Developer</h2> -->
        </div>
    </div>
</section>

<style>
    .home_background {
        background-image: url("./image/hello.gif");
        background-size: cover;
        width: 100%;
        height: 100vh;
        background-position: center center;
        position: relative;
        display: flex;
    }

    .container {
        margin: auto;
        width: 100%;
        height: 50vh;
        text-align: center;
        padding: 10vh;
        align-content: center;
        justify-content: center;
    }

    .content {
        margin: auto;
        position: absolute;
        top: 30%;
        left: 30%;
        z-index: 20;
    }

    .content h1 {
        margin: auto;
        font-size: 4rem;
        color: black;
        font-family: Bradley Hand, cursive;
    }

    .h2 {
        font-size: 2.5rem;
        color: black;
        font-family: Bradley Hand, cursive;
    }

    .home_background::before {
        background-color: rgba(255, 255, 255, 0.5);
        z-index: 1;
        position:absolute;
        display: block;
        width: 100%;
        height: 100vh;
        content: "";
        left: 0;
        bottom: 0;
        opacity: 0.6;
    }

</style>