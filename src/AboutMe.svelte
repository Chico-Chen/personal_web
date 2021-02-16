<div id="aboutMe" class="about-me">
    <div class="container">
        <h1 class="title">About Me</h1>
        <div class="content">
            <div class="image">
                <img src="./build/image/me.jpg" alt="me" />
            </div>
            <div class="text-content">
                <p>
                    Hello! My name is Chico(Qi) Chen and I am currently a
                    graduate student at Northeastern University pursuing a
                    master’s degree in Information System. I'm passinate about
                    software development, especially interested in web
                    development. I enjoy being challenged and get ready to learn
                    and try new stuff.
                </p>
            </div>
        </div>
    </div>
</div>

<style>
    .about-me {
        display: flex;
        text-align: center;
        padding: 75px 15px;
        background-color: #f8f9fa;
        font-family: Comic Sans MS, Comic Sans, cursive;
    }

    .container {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
    }

    .content {
        margin-left: -15px;
        margin-right: -15px;
    }

    .title {
        position: relative;
        display: inline-block;
        text-align: center;
        margin: auto;
        padding-top: 10vh;
    }

    .image {
        position: relative;
        padding-top: 45px;
        padding-bottom: 30px;
        padding-left: 15px;
        padding-right: 15px;
    }

    img {
        border-radius: 50%;
        max-width: 12vh;
        height: 15vh;
    }

    .text-content {
        width: 40%;
        display: flex;
        position: relative;
        margin: 0 auto 30px auto;
        padding: 15px;
        left: 0;
        right: 0;
        background-color: white;
        border-radius: 5%;
    }

    .text-content p {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        text-align: left;
    }
</style>
