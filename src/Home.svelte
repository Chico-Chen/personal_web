<script>
    import Typewriter from "./Typewriter.svelte";
</script>

<section class="home_background" id="home">
    <div class="container">
        <div class="content">
            <h1>Hello, I'm Chico Chen</h1>
            <Typewriter loop={true} interval={100}>
                <h2 class="h2">A Software Developer</h2>
            </Typewriter>
            <a
                class="download-button"
                href="https://drive.google.com/file/d/1exkhP-DC8RD-9zYpTku2G82J-RefM3xB/view?usp=sharing"
                >Download Resume</a
            >
        </div>
    </div>
</section>

<style>
    .home_background {
        background-image: url("./image/Hello.gif");
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
        /* height: 50vh; */
        text-align: center;
        /* padding: 10vh; */
        align-content: center;
        justify-content: center;
        display: flex;
    }

    .content {
        margin: 0 auto 30px auto;
        position: absolute;
        /* top: 30%;
        left: 30%; */
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
        position: absolute;
        display: block;
        width: 100%;
        height: 100vh;
        content: "";
        left: 0;
        bottom: 0;
        opacity: 0.6;
    }

    .download-button {
        padding: 7px 35px;
        border-radius: 60px;
        font-size: 25px;
        cursor: pointer;
        font-family: Comic Sans MS, Comic Sans, cursive;
        font-weight: 300;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.06),
            0 2px 10px 0 rgba(0, 0, 0, 0.07);
        -webkit-transition: all 300ms ease;
        transition: all 300ms ease;
        background-color: transparent;
        color: black;
        text-decoration: none;
        font-weight: 600;
    }

    .download-button:hover {
        transform: translateY(1px);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1),
            0 1px 1px 0 rgba(0, 0, 0, 0.09);
        background-color: #6b686b;
        color: white;
    }

</style>
