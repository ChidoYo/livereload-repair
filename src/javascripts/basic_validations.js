function numbersOnly(elem) {
  let regEx = new RegExp(/^\d+$/);
  return regEx.test(elem);
};

//note: 0 is a number
function decimalNumbers(elem) {
  let regEx = /^[-+]?[0-9]+\.[0-9]+$/;
  return (regEx.test(elem));
};


// validates everything on form submit - does not validate initially until the submit button has been clicked.
// Do not use with validateRequired(). You may provide custom validation messages, or allow the browser to provide it's own defaults.  This will allow for multiple validations of a single field
// - for example, the email fields is required, but also, it requires a valid email address.
export function replaceValidationUI( form, button ) {
  // Suppress the default bubbles
  form.addEventListener( "invalid", function( event ) {
    event.preventDefault();
  }, true );

  // Support Safari, iOS Safari, and the Android browser—each of which do not prevent
  // form submissions by default
  form.addEventListener( "submit", function( event ) {
    if ( !this.checkValidity() ) {
      event.preventDefault();
    }
  });

  // form field submit buttons should have 'type="submit"' not 'type="button"' - the next line prevents this script from targeting a cancel button, or a close button,
  // for example. If uncertain, then a call may be added to include the id of the button intended as "submit".
  let submitButton;

  if (button) {
     submitButton = document.getElementById(button);
  } else {
     submitButton = form.querySelector( "[type='submit']" );
  }

  submitButton.addEventListener( "click", function( event ) {
    let invalidFields = form.querySelectorAll( ":invalid:not(.d-none)" )

    // drop HTML5 error messages into the correct invalid-feedback fields.
    for (let i = 0; i < invalidFields.length; i++) {
      let message =  invalidFields[ i ].validationMessage;
      let invalid = invalidFields[i].getAttribute('id');
      let validation = form.querySelector(`#error-${invalid}`);
      if (validation.innerHTML === '')     {
        validation.innerHTML = message;
      }
      invalidFields[i].classList.add('is-invalid');
      invalidFields[i].addEventListener('blur', () => {
        if (invalidFields[i].checkValidity()) {
          invalidFields[i].classList.remove('is-invalid');
        }
      })
    }

    // If there are errors, give focus to the first invalid field
    if ( invalidFields.length > 0 ) {
      invalidFields[ 0 ].focus();
    }
  });
}

// validate that all required fields have input  - only use if replaceValidationUI cannot be used. Will validate on blur. Provide your own validation error messages in your code.
function validateRequired (form) {
  const thisForm = document.getElementById(form);
  const elements = (thisForm.elements);
  const allFields = Array.from(elements);
  // create an array of only the required fields
  let requiredFields = allFields.filter(field => field.hasAttribute('required'));


  for (let i = 0; i < requiredFields.length; i++) {
    let thisField = requiredFields[i];
    thisField.addEventListener('blur', (event) => {
      let thisField = event.target;
      let contents = thisField.value.replace(/\s/g, ""); //textareas may load with whitespace which counts as characters towards length.
      if (contents.length === 0 || !thisField.checkValidity()) {
        thisField.classList.add('is-invalid');
      } else {
        thisField.classList.remove('is-invalid');
      }
    })
  }
}

// run on submit to return user back to the first field that is not valid
function toError(form) {
  const thisForm = $(form);
  let errors = (thisForm.find('.is-invalid'));
  let firstError = errors[0];

  if (!firstError) {
    return;
  } else {
    firstError.focus();
  }
}

// Replace the validation UI for all forms - do not replace "var" with const or let - it causes a syntax error and everything stops working.
// use case example:
/*
 window.addEventListener('DOMContentLoaded', (event) => {
  var forms = document.querySelectorAll( 'form' );

  for ( let i = 0; i < forms.length; i++ ) {
  replaceValidationUI( forms[ i ] );
  OR
  validateRequired( forms[i] );
   }
});
*/
