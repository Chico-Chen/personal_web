<div id="projects">
    <h1 class="title">Projects</h1>
    <div class="container">
        <ul class="cards">
            <li class="cards__item">
                <div class="card">
                    <div class="card__image card__image--fence" />
                    <div class="card__content">
                        <div class="card__title">TodoList app</div>
                        <span>Svelte</span>
                        <span />
                        <p class="card__text">
                            Created a todolist application with Svelte, enabled
                            user edit tasks and add checklists for each task
                        </p>
                        <ul>
                            <li>
                                <a
                                    href="https://github.com/Chico-Chen/svelte_practice"
                                >
                                    <i class="fa fa-github" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://chicoq1996.medium.com/svelte-starter-building-a-todo-list-app-b39cced5b770"
                                >
                                    <i class="fa fa-medium" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
            <li class="cards__item">
                <div class="card">
                    <div class="card__image card__image--river" />
                    <div class="card__content">
                        <div class="card__title">Location Sharing App</div>
                        <span>React, ExpressJS, MongoDB, Restful APIs</span>
                        <p class="card__text">
                            Implemented an application where users can share
                            places with images and location with other users
                        </p>
                        <ul>
                            <li>
                                <a
                                    href="https://github.com/Chico-Chen/share-places-frontend"
                                >
                                    <i class="fa fa-github" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>

<style type="text/scss">
    #projects {
        display: block;
        text-align: center;
        padding: 50px 2vh;
        background-image: url("./image/project-bg.png");
        background-size: cover;
        color: white;
        font-family: Comic Sans MS, Comic Sans, cursive;
    }

    .title {
        text-align: center;
        margin: auto;
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
        z-index: 100;
        display: absolute;
    }

    p {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    $gray-darker: #444444;
    $gray-dark: #696969;
    $gray: #999999;
    $gray-light: #cccccc;
    $gray-lighter: #ececec;
    $gray-lightest: lighten($gray-lighter, 4%);

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    // img {
    //     height: auto;
    //     max-width: 100%;
    //     vertical-align: middle;
    // }

    // .btn {
    //     background-color: white;
    //     border: 1px solid $gray-light;
    //     //border-radius: 1rem;
    //     color: $gray-dark;
    //     padding: 0.5rem;
    //     text-transform: lowercase;
    // }

    // .btn--block {
    //     display: block;
    //     width: 100%;
    // }

    .cards {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .cards__item {
        display: flex;
        padding: 1rem;
        @media (min-width: 40rem) {
            width: 50%;
        }
        @media (min-width: 56rem) {
            width: 33.3333%;
        }
    }

    .card {
        background-color: #54aca6;
        border-radius: 0.25rem;
        box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        &:hover {
            .card__image {
                filter: contrast(100%);
            }
        }
    }

    .card__content {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        padding: 1rem;
    }

    .card__image {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        filter: contrast(70%);
        //filter: saturate(180%);
        overflow: hidden;
        position: relative;
        transition: filter 0.5s cubic-bezier(0.43, 0.41, 0.22, 0.91);
        &::before {
            content: "";
            display: block;
            padding-top: 56.25%; // 16:9 aspect ratio
        }
        @media (min-width: 40rem) {
            &::before {
                padding-top: 66.6%; // 3:2 aspect ratio
            }
        }
    }

    .card__image--river {
        background-image: url("./image/SharePlaces.png");
    }

    .card__image--fence {
        background-image: url("./image/SvelteScreenShot.gif");
    }

    .card__title {
        color: white;
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    .card__text {
        flex: 1 1 auto;
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1.25rem;
    }

    ul {
        display: flex;
        list-style: none;
        padding-left: 0;
        text-align: center;
        margin: auto;
    }

    li {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        display: block;
    }

    .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        text-decoration: none;
        font-size: 15px;
        text-align: center;
        padding: 10px;
        border-radius: 100%;
    }

    .fa-github {
        background: #6b686b;
        color: white;
    }

    .fa-github:hover {
        transform: translateY(1px);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1),
            0 1px 1px 0 rgba(0, 0, 0, 0.09);
    }

    .fa-medium {
        background: #6b686b;
        color: white;
    }

    .fa-medium:hover {
        transform: translateY(1px);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1),
            0 1px 1px 0 rgba(0, 0, 0, 0.09);
    }
</style>
