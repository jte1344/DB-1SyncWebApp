// Todo:
// -transition to class-based architecture
// -add scroll trigger
var site_base = '//mailing.nullbits.co';
var last_pressed = "none";
var configuration;
var template = `
<div class="modal fade list-builder" id="emailModal">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content background-{{theme}}">
      <div class="modal-header background-{{theme}} text-center">
        <h5 class="modal-title w-100" id="ModalTitle">{{title_text}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p id="ModalBodyText">{{body_text}}</p>
        <form id="ModalFormBody">
            <div class="form-group">
                <input type="hidden" id="ABConfigID" name="ab_config_id" value="{{id}}"/>
                <input type="hidden" id="EventSource" name="event_source" value="{{event_source}}"/>
                <input class="form-control" id="EmailAddress" name="email_address" type="email" placeholder="Email Address" />
                <p class="help-block" id="error_email" style="color:#ff9544"></p>
            </div>
        </form>
        <b><p id="ModalThanksText" style="display:none;">{{submit_complete_text}}</p></b>
        <small><i><p id="ModalDisclaimerText">{{disclaimer_text}}</p></i></small>
      </div>
      <div class="modal-footer background-{{theme}}" id="ModalFooter">
        <button type="button" class="btn btn-secondary" id="ModalNegativeButton" data-dismiss="modal">{{negative_action_text}}</button>
        <button type="button" class="btn btn-info" id="ModalAffirmativeButton">{{affirmative_action_text}}</button>
    </div>
  </div>
</div>
`;

$(function () {
    form_init();
});

function init_handlers() {
    // Modal handlers
    $("#emailModal").on("hidden.bs.modal", function () {
        if (last_pressed == "none") {
            // The user clicked the X button, or outside the modal
            console.log("Modal closed with x!");

            // Don't show for X days
            setCookie("email-prompt-hidden", "true", configuration.cookie_timeout_length);
        }
    });

    $("#ModalAffirmativeButton").click(function () {
        console.log("affirmative_action_handler!")
        last_pressed = "yes";

        elem = document.getElementById('EmailAddress')
        if (!validateEmail(elem.value)) {
            console.log("email validation error!")
            $("#error_email").text("Please enter a valid email.")
            return false;
        }

        $.ajax({
            type: "POST",
            url: site_base + "/email-list",
            data: $("#ModalFormBody").serialize(),
            success: function (data) {
                var result = $.parseJSON(data);
                if (result.success) {
                    // Don't show for X days
                    setCookie("email-prompt-hidden", "true", configuration.cookie_timeout_length);
                    thanks();
                } else {
                    //server side validation error
                    $("#error_email").text(result.error)
                }
            }
        });
    });

    $("#ModalNegativeButton").click(function () {
        console.log("negative_action_handler")
        last_pressed = "no";

        // Don't show for X days
        setCookie("email-prompt-hidden", "true", configuration.cookie_timeout_length);
    });

    $("#EmailAddress").change(function () {
        elem = document.getElementById('EmailAddress')
        if (validateEmail(elem.value)) {
            $("#error_email").text("")
        } else {
            $("#error_email").text("Please enter a valid email.")
        }
    });

    $('#ModalFormBody').submit(function () {
        return false;
    });
}

function sendInlineForm(form_id) {
    elem = document.getElementById('InlineEmailAddress' + form_id)
    if (!validateEmail(elem.value)) {
        console.log("email validation error!")
        $("#InlineEmailError" + form_id).text("Please enter a valid email.")
        return false;
    }

    $.ajax({
        type: "POST",
        url: site_base + "/email-list",
        data: $("#InlineEmailForm" + form_id).serialize(),
        success: function (data) {
            var result = $.parseJSON(data);
            if (result.success) {
                console.log("Success!");
                var msg = "Thanks for the interest! We'll be in touch."
                $("#InlineEmailError" + form_id).text(msg)
            } else {
                //server side validation error
                console.log("Error: " + result.error);
                $("#InlineEmailError" + form_id).text(result.error)
            }
        }
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function setCookie(cname, cvalue, exsecs) {
    console.log("setting cookie", cname, "to", cvalue, "timeout = ", exsecs);
    var d = new Date();
    d.setTime(d.getTime() + (exsecs * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function thanks() {
    document.getElementById('ModalThanksText').style.display = "initial";
    var ids = ['ModalFooter', 'ModalBodyText', 'ModalDisclaimerText', 'ModalFormBody'];

    ids.forEach(function (id) {
        try {
            document.getElementById(id).style.display = "none";
        }
        catch (err) {
            console.log(err);
        }
    });
}

function getElementsByText(str, tag = 'a') {
    return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}

function build_HTML(template, context) {
    // Iterate over all available vars in context
    for (const prop in context) {
        target_var = "{{" + prop + "}}"
        // Check to see if context.var is present in {{}} template form
        while (template.includes(target_var)) {
            // If so, replace {{}} template text with context.var.value
            if (context[prop]) {
                template = template.replace(target_var, context[prop]);
            } else {
                template = template.replace(target_var, "{{NULLVALUE}}");
            }
        }
    }

    // Render and inject template into base HTML
    email_form_base = document.getElementById('email-list-template');
    email_form_base.innerHTML = template;

    // Secondary pass to remove elements with NULLVALUE
    var tags = ['button', 'p', 'div', 'span', 'a'];
    var nullvalues = []
    tags.forEach(function (tag) {
        var tmp = getElementsByText("{{NULLVALUE}}", tag);
        if (tmp.length > 0) nullvalues = nullvalues.concat(tmp);
    });
    nullvalues.forEach(function (elem) {
        elem.parentNode.removeChild(elem);
    });
}

function render_modal(configuration) {
    build_HTML(template, configuration);
    init_handlers();

    $('#emailModal').modal({
        show: true,
        keyboard: false,
        backdrop: 'static',
        focus: true
    })
}

function show_email_form(configuration) {
    // Check if the form should be shown w/ cookie
    if (getCookie("email-prompt-hidden") == "true") {
        console.log("cookie already set, aborting");
        return;
    }

    // Write event source, so we can return later.
    configuration.event_source = window.location.href;

    // Show modal
    render_modal(configuration);

    // Update 'times shown' statistic
    $.ajax({
        type: "POST",
        url: site_base + "/ab-stats",
        data: { "id": configuration.id },
        success: function (data) {
            var result = $.parseJSON(data);
            if (result.success) {
                console.log("a/b update: id <" + configuration.id + "> shown")
            }
        }
    });
}

function form_init() {
    var style = `
    <style>
    .list-builder {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #0000004a;
        opacity: 0.95 !important;
        display: none;
    }
    .background-dark {
        border-color: #000000 !important; 
        background-color: #464646 !important;
        color: #e8e8e8 ;
    }
    </style>
    `;
    $('head').append(style);

    // Get the form configuration
    var result;

    $.ajax({
        type: "GET",
        url: site_base + "/js-params",
        data: "",
        success: function (data) {
            result = $.parseJSON(data);
            configuration = result.configuration;
            switch (result.configuration.trigger_mode) {
                case "timeout":
                    // Trigger mode: timeout
                    timeout_val = Number(result.configuration.trigger_params);
                    console.log("showing form with mode: timeout in <" + timeout_val + "> ms");
                    setTimeout(show_email_form, timeout_val, result.configuration);
                    break;

                case "scroll":
                    // Trigger mode: scroll
                    //todo

                    break;

                default:
                    console.log("Unknown trigger_mode. Abort!")
                    break;
            }
        }
    });
}