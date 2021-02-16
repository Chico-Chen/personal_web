<script>
    import * as animateScroll from "svelte-scrollto";
</script>
<div id="header" class="header">
    <ul class="nav">
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#home'} href='#home'>Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#aboutMe'} href='#aboutMe'>About Me</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#experience'} href='#experience'>Experience</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#education'} href='#education'>Education</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#projects'} href='#projects'>Projects</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#skills'} href='#skills'>Skills</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" use:animateScroll.scrollto={'#contact'} href='#skills'>Contact</a>
        </li>
    </ul>
</div>

<style>
    .header {
        display: flex;
        text-align: center;
        flex-basis: 100%;
        position: fixed;
        background-color: #6b686b;
        z-index: 999;
        width: 100%;
        height: 6.5vh;
        font-family: Comic Sans MS, Comic Sans, cursive;
        border-radius: 2%;
    }

    ul {
        margin-top: 0;
        align-items: center;
        margin: auto;
        position: relative;
    }

    a {
        text-decoration: none;
        color: rgb(235, 223, 223);
    }

    a:hover {
        color: #fff;
    }

    .nav {
        display: flex;
        list-style: none;
        padding-left: 0;
        text-align: center;
    }

    .nav-item {
        margin: 0.7rem;
    }

    .nav-link {
        font-weight: 600;
        padding-left: .5rem;
        padding-right: .5rem;
        display: block;
    }
</style>