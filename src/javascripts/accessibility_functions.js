var checkbox = $("input[type='checkbox']");
var radio = $("input[type='radio']");

// translate any keypress on an object into a click
// todo: remove jQuery dependency
$('body').keypress( function(e) {
   var keycode = e.keyCode || e.which;
    if (keycode === 13) {
        (e.target).click();
    }
});

// translate a click on a row, via the above function, into a click on a table cell, to trigger relocation to a card over via that script.
$('body').on('click', 'tr.clickable', function(e) {
    $(e.target).find('td:not(".notClickable")' || 'td:not(".actions")').click();
});

// call keyboardFocus on specific pages where the focus needs to be moved from a tab title to inside the tab contents, and add var keycode to that page as a global variable.
function keyboardFocus() {

    if (keycode === 13) { // set by the keydown function below, the keycode tells us if this was an enter key event or a mouse click event.
        var focusHere = ($(this).attr('href') + '-anchor');
        $(focusHere).attr('tabindex', '0').focus();
    }
    keycode = '0'; // reset keycode to something not 13, so that if the next trigger is a click, the focus functionality won't trigger.

};

//return focus to element

function bounceBack(elem) {
  elem.focus();
}
