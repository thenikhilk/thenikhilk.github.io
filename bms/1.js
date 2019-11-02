const EXISTING_VALUES = [7000, 7001, 7002, 7003, 7004, 7005];

// Initialize namespace
var BMS = BMS ? BMS : {};

// Initialize constants
BMS.Constants = {
    VALIDATION_PATTERN: /^[0-9,-\s]*$/g,
    INVALID_MESSAGE_CLASS: "invalid-feedback",
    VALID_MESSAGE_CLASS: "valid-feedback",
};

// alert message
BMS.Alerts = {
    INVALID_INPUT: `Invalid input provided. Only numerics are allowed. <br> 
    For single number enter number; e.g. 123 <br> 
    For multiple numbers, enter comma (,) separated values; e.g. 123,456 <br>
    For range enter start and end value; e.g. 10-20`
};

// Message types
BMS.MessageTypes = {
    VALID: 1,
    INVALID: 2
};

// validation message display
BMS.validationMessage = function (show, message, type) {
    if (show && message) {
        BMS.validationMessage(false);
        switch (type) {
            case 1:
                $("#validation-message").addClass(BMS.Constants.VALID_MESSAGE_CLASS).html(message);
                break;
            case 2:
                $("#validation-message").addClass(BMS.Constants.INVALID_MESSAGE_CLASS).html(message);
                break;
            default:
                break;
        }
    } else {
        $("#validation-message").html("").removeClass(BMS.Constants.VALID_MESSAGE_CLASS).removeClass(BMS.Constants.INVALID_MESSAGE_CLASS);
    }
};

// parse result
BMS.renderResult = function (numbers) {
    let existing = [], toBeAdded = [];
    let result = "";
    $.each(numbers, function (index, number) {
        if (!isNaN(number)) {
            if (-1 != EXISTING_VALUES.indexOf(number)) {
                existing.push(number);
            }
            else {
                toBeAdded.push(number);
            }
        }
    });
    if (toBeAdded.length) {
        result = `<strong>Values to be added</strong>: ${toBeAdded.join(" ,")}<br>`;
    }
    if (existing.length) {
        result += `<strong>Existing values</strong>: ${existing.join(" ,")}`;
    }
    BMS.validationMessage(true, result, BMS.MessageTypes.VALID);
};

// validate inputs
BMS.validateInput = function (value) {
    if (value) {
        value = $.trim(value);
        // validate input pattern
        if (value.match(BMS.Constants.VALIDATION_PATTERN) &&
            !(1 < value.split("-").length && 1 < value.split(",").length)) {
            //check type
            if (-1 != value.indexOf(",")) {
                // check multiple values
                let numbers = value.split(",").map(function (item) {
                    return parseInt(item.trim());
                });
                BMS.renderResult(numbers);
            } else if (-1 != value.indexOf("-")) {
                // check range
                let range = value.split("-");
                if (2 == range.length) {
                    // generate range
                    let numbers = [];
                    for (var index = parseInt(range[0]); index <= parseInt(range[1]); index++) {
                        numbers.push(index);
                    }
                    BMS.renderResult(numbers);
                } else {
                    BMS.validationMessage(true, BMS.Alerts.INVALID_INPUT, BMS.MessageTypes.INVALID);
                }
            } else {
                // check single number
                BMS.renderResult([parseInt(value)]);
            }
        } else {
            BMS.validationMessage(true, BMS.Alerts.INVALID_INPUT, BMS.MessageTypes.INVALID);
        }
    } else {
        BMS.validationMessage(false);
    }
};

// Bind events
BMS.bindEvents = function () {
    // input validation
    $("input").bind("keyup keypress", function () {
        let value = $(this).val().toString();
        BMS.validateInput(value);
    });
};

// When DOM is ready
$(document).ready(function () {
    BMS.bindEvents();
});
