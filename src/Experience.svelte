<div class="experience" id="experience">
    <h1 class="title">Experience</h1>
    <div class="timeline">
        <h2 class="timeline_item timeline_item--year">2018</h2>
        <div class="timeline_item">
            <h3 class="timeline_title">ZhuanZhuan Company</h3>
            <h4>Java Intern</h4>
            <p class="timeline_blurb">
                - Built a product management website in Java to help company
                visualize the product sales tendency, using Spring MVC and
                MyBatis to communicate with MySQL database
            </p>
            <p class="timeline-blurb">
                - Updated user’s searching result with JQuery AJAX instead of
                refreshing the webpage
            </p>
        </div>
        <h2 class="timeline_item timeline_item--year">2021</h2>
        <div class="timeline_item">
            <h3 class="timeline_title">Futuriest Academy</h3>
            <h4>Software Engineer Intern</h4>
            <p class="timeline_blurb">
                - Gained knowledge about graph database, GSQL, and web framework Svelte
            </p>
            <p class="timeline-blurb">
                - Building an Android application capture mobile screen usage
            </p>
        </div>
    </div>
    <div class="footer"></div>
</div>

<style type="text/scss">

    .experience {
        width: 100%;
        background-image: url("./image/experience-bg.png");
        background-size: cover;
        font-family: Comic Sans MS, Comic Sans, cursive;
    }

    h3, h4, p {
        margin-block-start: 0.5em;
        margin-block-end:  0.5em;
    }

    .title {
        text-align: center;
        margin: auto;
        padding: 75px;
    }

    $color: skyblue;
    $lineColor: #7bccc6;
    $fontColor: #6b686b;
    $bgColor1: rgb(160, 156, 156);
    $bgColor2: #444;
    $yearBgColor: #fbd28b;

    $breakpoint: 700px;

    * {
        box-sizing: border-box;
    }


    .timeline {
        position: relative;
        padding: 1rem;
        margin: 0 auto;
        max-width: 1300px;
        text-align: left;

        &:before {
            content: "";
            position: absolute;
            height: 100%;
            border: 3px solid $lineColor;
            right: 40px;
            top: 0;
        }

        &:after {
            content: "";
            display: table;
            clear: both;
        }

        @media screen and (min-width: $breakpoint) {
            padding: 2rem;
            &:before {
                left: calc(50% - 1px);
                right: auto;
            }
        }
    }

    .timeline_item {
        padding: 1rem;
        border: 5px solid $lineColor;
        border-image: linear-gradient(to right, $color 0%, $lineColor 100%);
        border-image-slice: 1;
        position: relative;
        margin: 1rem 3rem 1rem 1rem;
        clear: both;
        background-color: $yearBgColor;

        &:after,
        &:before {
            content: "";
            position: absolute;
        }

        &:before {
            right: -10px;
            top: calc(50% - 5px);
            border-style: solid;
            border-color: $lineColor $lineColor transparent transparent;
            border-width: 10px;
            transform: rotate(45deg);
        }

        @media screen and (min-width: $breakpoint) {
            width: 44%;
            margin: 1rem;

            &:nth-of-type(2n) {
                float: right;
                margin: 1rem;
                border-image: linear-gradient(
                    to right,
                    $lineColor 0%,
                    $color 100%
                );
                border-image-slice: 1;

                &:before {
                    right: auto;
                    left: -10px;
                    border-color: transparent transparent $lineColor $lineColor;
                }
            }
        }
    }

    .timeline_item--year {
        text-align: center;
        max-width: 150px;
        margin: 0 48px 0 auto;
        font-size: 1.8rem;
        background-color: $yearBgColor;
        line-height: 1;
        border-image: none;
        padding: 0.5rem 1rem 1rem;

        &:before {
            display: none;
        }

        @media screen and (min-width: $breakpoint) {
            text-align: center;
            margin: 0 auto;

            &:nth-of-type(2n) {
                float: none;
                margin: 0 auto;
                border-image: none;

                &:before {
                    display: none;
                }
            }
        }
    }

    .timeline_title {
        margin: 0;
        font-size: 1.5em;
    }

    .timeline_blurb {
        line-height: 1.5;
        font-size: 1rem;
        margin: 0.5rem 0 0;
    }

    .footer {
        height: 50px;
    }
</style>
