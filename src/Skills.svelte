<div id="skills">
    <h2 class="title">Skills</h2>
    <div class="container">
        <div class="left-content">
            <h3>Web Framework Skills</h3>
            <div class="skill">
                <div class="skill-name">
                    Angular
                    <span class="badge float-right">85%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:85%"
                        aria-valuenow="85"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
            <div class="skill">
                <div class="skill-name">
                    React
                    <span class="badge float-right">80%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:80%"
                        aria-valuenow="80"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
            <div class="skill">
                <div class="skill-name">
                    Svelte
                    <span class="badge float-right">80%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:80%"
                        aria-valuenow="80"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
            <div class="skill">
                <div class="skill-name">
                    Flutter
                    <span class="badge float-right">40%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:40%"
                        aria-valuenow="40"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
        </div>
        <div class="left-content">
            <h3>Programming Languages</h3>
            <div class="skill">
                <div class="skill-name">
                    Java
                    <span class="badge float-right">90%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:90%"
                        aria-valuenow="90"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
            <div class="skill">
                <div class="skill-name">
                    JavaScript
                    <span class="badge float-right">80%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:80%"
                        aria-valuenow="80"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
            <div class="skill">
                <div class="skill-name">
                    C++
                    <span class="badge float-right">75%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:75%"
                        aria-valuenow="75"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
            <div class="skill">
                <div class="skill-name">
                    Python
                    <span class="badge float-right">70%</span>
                </div>
                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:70%"
                        aria-valuenow="70"
                        aria-valuemax="100"
                        aria-valuemin="0"
                    />
                </div>
            </div>
        </div>
    </div>
    <div />
</div>

<style>
    #skills {
        display: block;
        text-align: center;
        padding: 50px 2vh;
        background-color: #f8f9fa;
    }

    .title {
        text-align: center;
        margin: auto;
        font-family: Snell Roundhand, cursive;
        padding: 15px;
    }

    .container {
        display: flex;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
        margin-top: 2rem;
        font-family: Snell Roundhand, cursive;
    }

    .left-content {
        position: relative;
        min-height: 1px;
        padding-left: 3rem;
        padding-right: 3rem;
        width: 40%;
        text-align: left;
        margin: 0 auto 30px auto;
    }

    .skill {
        margin-top: 1rem;
    }

    .skill .skill-name {
        margin-bottom: 0.5rem;
        display: block;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .float-right {
        float: right;
    }

    .badge {
        display: inline-block;
        padding: 0.35em 0.5em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        color: #ffffff;
        background-color: #6b686b;
    }

    .progress {
        display: flex;
        height: 0.375rem;
        overflow: hidden;
        font-size: 0.75rem;
        background-color: #e9ecef;
        border-radius: 0.25rem;
    }

    .progress-bar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #ffffff;
        text-align: center;
        background-color: #6b686b;
        transition: width 0.6s ease;
    }
</style>
