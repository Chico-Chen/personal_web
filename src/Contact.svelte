<script>
    import {} from "os";
</script>

<div id="contact">
    <h1 class="title">Stay Connected</h1>
    <!-- <div class="form"> -->
    <div class="container">
        <form
            method="POST"
            action="https://formkeep.com/f/010e1db52313"
            accept-charset="UTF-8"
            enctype="multipart/form-data"
        >
            <div class="row input-container">
                <div class="col-md-6 col-sm-12">
                    <div class="styled-input">
                        <input type="text" name="_name" required />
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label>Name</label>
                    </div>
                </div>
                <div class="col-md-6 col-sm-12">
                    <div class="styled-input" style="float:right;">
                        <input type="text" name="_replyto" required />
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label>Email</label>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="styled-input wide">
                        <textarea name="message" required />
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label>Message</label>
                    </div>
                </div>
                <div class="col-xs-12">
                    <!-- <input type="submit" class="btn-lrg submit-btn" value="Send Message"/> -->
                    <button type="submit" class="btn-lrg submit-btn"
                        >Send Message</button
                    >
                </div>
            </div>
        </form>
    </div>
    <div class="footer" />
</div>

<style>
    #contact {
        background-image: url("./image/contact-bg.png");
        background-size: cover;
        color: white;
    }

    .title {
        text-align: center;
        margin: auto;
        font-family: Snell Roundhand, cursive;
        padding-top: 75px;
        font-weight: 700px;
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
        font-family: Snell Roundhand, cursive;
    }

    input:focus ~ label,
    textarea:focus ~ label,
    input:valid ~ label,
    textarea:valid ~ label {
        font-size: 0.75em;
        color: white;
        top: -5px;
        -webkit-transition: all 0.225s ease;
        transition: all 0.225s ease;
    }

    .styled-input {
        float: left;
        width: 293px;
        margin: 1rem 0;
        position: relative;
        border-radius: 4px;
    }

    @media only screen and (max-width: 768px) {
        .styled-input {
            width: 100%;
        }
    }

    .styled-input label {
        color: white;
        padding: 1.3rem 30px 1rem 30px;
        position: absolute;
        top: 10px;
        left: 0;
        -webkit-transition: all 0.25s ease;
        transition: all 0.25s ease;
        pointer-events: none;
    }

    .styled-input.wide {
        width: 650px;
        max-width: 100%;
    }

    input,
    textarea {
        padding: 30px;
        border: 0;
        width: 100%;
        font-size: 1rem;
        background-color: #5b99cf;
        color: white;
        border-radius: 4px;
    }

    input:focus,
    textarea:focus {
        outline: 0;
    }

    textarea {
        width: 100%;
        min-height: 15em;
    }

    .input-container {
        width: 650px;
        max-width: 100%;
        margin: 20px auto 25px auto;
    }

    .submit-btn {
        float: right;
        padding: 7px 35px;
        border-radius: 60px;
        display: inline-block;
        background-color: #5b99cf;
        color: white;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.06),
            0 2px 10px 0 rgba(0, 0, 0, 0.07);
        -webkit-transition: all 300ms ease;
        transition: all 300ms ease;
        border: none;
    }

    .submit-btn:hover {
        transform: translateY(1px);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1),
            0 1px 1px 0 rgba(0, 0, 0, 0.09);
    }

    @media (max-width: 768px) {
        .submit-btn {
            width: 100%;
            float: none;
            text-align: center;
        }
    }

    .footer {
        height: 50px;
    }
</style>
