<script>
    let more = false;
</script>

<div id="projects">
    <h1 class="title">Projects</h1>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <span class="font-weight-bold">Location Sharing App</span>
                <p>React, ExpressJS, MongoDB, Restful APIs</p>
                <p>
                    - Implemented an application where users can share places
                    with images and location with other users
                </p>
                <p>
                    - Built RESTful API (set up backend) by using ExpressJS and
                    integrated with React Axios and hooks call
                </p>
                <p>
                    - Utilized Google’s Geocoding API to convert addresses into
                    coordinates and inserted a customed rendering google map to
                    show the shared place on Map
                </p>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <span class="font-weight-bold">Second-hand Phone Transaction Platform</span>
                <p>Java8, Hibernate, MySQL, Concurrency</p>
                <p>
                    - Designed and built the platform which enables trade, stock management and product management
                </p>
                <p>
                    - Developed the backend using Java8 and Hibernate to communicate with MySQL database, and enabled CRUD operations for phone product and orders 
                </p>
                <p>
                    - Utilizing Multi-thread and Socket to allow multiple customers transact at same time on local area network
                </p>
            </div>
            <div class="grid"></div>
        </div>
    </div>

    <div></div>
</div>

<style>
    #projects {
        display: block;
        text-align: center;
        padding: 50px 2vh;
        background-image: url("./image/project-bg.png");
        background-size: cover;
        color: white;
    }

    .title {
        text-align: center;
        margin: auto;
        font-family: Snell Roundhand, cursive;
        padding: 15px;
        z-index: 15;
        font-weight: 700px;
    }

    .container {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
        margin-top: 2rem;
        font-family: Snell Roundhand, cursive;
        z-index: 100;
        display: absolute;
    }

    .grid {
        display: flex;
    }

    .card {
        max-width: 50%;
        flex: 0 0 40%;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #54aca6;
        background-clip: border-box;
        border: 0px solid rgba(0, 0, 0, 0.125);
        border-radius: 0.25rem;
        margin: 40px;
        margin-left: 5vh;
        margin-bottom: 1rem;
        position: relative;
        display: flex;
        margin: 0 auto 30px auto;
        box-shadow: 0 3px 6px rgb(0 0 0 / 8%), 0 3px 6px rgb(0 0 0 / 15%);
    }

    .card-body {
        flex: 1 1 auto;
        padding: 1.25rem;
        display: inline-block;
        text-align: left;
    }

    .font-weight-bold {
        font-weight: 700;
    }

    p {
        margin-top: 0;
        margin-bottom: 1rem;
    }
</style>
