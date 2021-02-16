<div id="education">
    <h2 class="title">Education</h2>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <span class="font-weight-bold">2019-2021</span>
                <h5>Master in Information Systems</h5>
                <p class="text-muted small-xl">Northeastern University</p>
                <p>-GPA: 3.52/4.00</p>
                <p>-Relevant Courses: Web Development, Data Structure & Algorithm, Parallelism & Concurrency</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <span class="font-weight-bold">2014-2018</span>
                <h5>Master in Software Engineering</h5>
                <p class="text-muted small-xl">Inner Mongolia University</p>
                <p>-GPA: 3.5/4.00</p>
                <p>-Relevant Courses: Probability and Statistics, Data Structure & Algorithm, Software Engineer</p>
            </div>
        </div>
    </div>
</div>

<style>
    #education {
        display: block;
        text-align: center;
        padding: 50px 2vh;
        background-color: #f8f9fa;
        font-family: Comic Sans MS, Comic Sans, cursive;
    }

    .title {
        text-align: center;
        margin: auto;
        padding: 15px;
    }

    .container {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        display: inline-block;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
        margin-top: 2rem;
    }

    .card {
        max-width: 50%;
        flex: 0 0 40%;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #ffffff;
        background-clip: border-box;
        border: 0px solid rgba(0, 0, 0, 0.125);
        border-radius: 0.25rem;
        margin: 40px;
        margin-left: 5vh;
        margin-bottom: 1rem;
        position: relative;
        display: flex;
        margin: 0 auto 30px auto;
    }

    .card-body {
        flex: 1 1 auto;
        padding: 1.25rem;
        display: inline-block;
        text-align: left;
    }

    .font-weight-bold {
        color: #868e96;
        font-weight: 700;
    }

    h5 {
        margin-bottom: 0.5rem;
        font-family: inherit;
        font-weight: 700;
        line-height: 1.2;
        color: #000000;
    }

    p {
        margin-top: 0;
        margin-bottom: 1rem;
    }
</style>
