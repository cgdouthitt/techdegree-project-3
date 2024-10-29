/******************************************
Treehouse FSJS Techdegree:
project 3 - Dynamic form validation
******************************************/

//Select elements and setting initial values
//Basic Info
const form = document.querySelector('form');
const userName = document.getElementById('name');
userName.focus();
const userEmail = document.getElementById('email');
//T-Shirt Info
const jobRole = document.getElementById('title');
const otherJobRole = document.getElementById('other-job-role');
otherJobRole.style.display = 'none';
const design = document.getElementById('design');
const color = document.getElementById('color');
const colorOptions = color.children;
color.disabled = true;
//Register for Activities
const activities = document.getElementById('activities');
const activityOptions = activities.querySelectorAll(`div > label input[type=checkbox]`);
const activitiesCost = document.getElementById('activities-cost');
let total = 0;
//Payment Info
const paymentMethod = document.getElementById('payment');
const creditSection = document.getElementById('credit-card');
const paypalSection = document.getElementById('paypal');
const bitcoinSection = document.getElementById('bitcoin');
paypalSection.style.display = 'none';
bitcoinSection.style.display = 'none';
paymentMethod.children[1].setAttribute('selected', true);
const cardNumber = document.getElementById('cc-num');
const zipcode = document.getElementById('zip');
const cvv = document.getElementById('cvv');

//element regex for test function
const nameRegEx = /.+/;
const emailRegEx = /^[^@]+@[^@]+\.(com|net)$/;
const cardNumberRegEx = /^\d{13,16}$/;
const zipcodeRegEx = /^\d{5}$/;
const cvvRegEx = /^\d{3}$/;

//Job role change event listener to display 'other job role' text box only when 'other' selection is made
jobRole.addEventListener('change', (e) => {
    const selectedRole = e.target.value;
    if(selectedRole === 'other'){
        otherJobRole.style.display = '';
    } else {
        otherJobRole.style.display = 'none';
    }
});

//Design change event listener to display only related color options based on selected design
design.addEventListener('change', (e) => {
    color.disabled = false;
    const selectedDesign = e.target.value;
    for( let i = 1; i < colorOptions.length; i++ ){
        const colorOption = colorOptions[i];
        const colorTheme = colorOptions[i].getAttribute('data-theme');
        if(colorTheme === selectedDesign) {
            colorOption.hidden = false;
            colorOption.setAttribute('selected', true);
        } else {
            colorOption.hidden = true;
            colorOption.removeAttribute('selected', false);
        }
    }
});


//Register for Activities change event listener to add/subtract from total based on selected activities
activities.addEventListener('change', (e) => {
    const selectedActivity = e.target;
    const activityCost = +e.target.getAttribute('data-cost');
    if(selectedActivity.checked) {
        total += activityCost;
    } else {
        total -= activityCost;
    }
    activitiesCost.innerHTML = `Total: $${total}`;

    //Register for Activities logic to disable conflicting actities based on matching 'data-day-and-time' attribute
    const allActivities = activities.querySelectorAll(`div label input[type="checkbox"]`);
    const selectedDayTime = e.target.getAttribute('data-day-and-time');
    const selectedActivityName = e.target.getAttribute('name');
    for( let i = 0; i < allActivities.length; i++ ){
        const dayTime = allActivities[i].getAttribute('data-day-and-time');
        const activityName = allActivities[i].getAttribute('name');
        if (selectedDayTime === dayTime && selectedActivityName !== activityName ) {
            if(e.target.checked) {
                allActivities[i].disabled = true;
                allActivities[i].parentElement.classList.add('disabled');
            } else {
                allActivities[i].disabled = false;
                allActivities[i].parentElement.classList.remove('disabled');
            } 
        }
    }

    //Register for Activities logic to add error/valid classes and show/hide hints
    const activitiesTest = activities.querySelectorAll('div label input:checked').length;
    if(activitiesTest <= 0) {
        activities.classList.add('not-valid');
        activities.classList.remove('valid');
        activities.querySelector('#activities-hint').style.display = 'block';
    } else {
        activities.classList.remove('not-valid');
        activities.classList.add('valid');
        activities.querySelector('#activities-hint').style.display = 'none';
    }
      
});

//Register for Activities submit event listener to add error/valid classes and show/hide hints
form.addEventListener('submit', (e) => {
    const activitiesTest = activities.querySelectorAll('div label input:checked').length;
    if(activitiesTest <= 0) {
        e.preventDefault();
        activities.classList.add('not-valid');
        activities.classList.remove('valid');
        activities.querySelector('#activities-hint').style.display = 'block';
    } else {
        activities.classList.remove('not-valid');
        activities.classList.add('valid');
        activities.querySelector('#activities-hint').style.display = 'none';
    }
});

//Register for Activities focus/blur event listener to add/remove focus classes
for ( let i = 0; i < activityOptions.length; i++ ) {
    activityOptions[i].addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focus');
    })
    activityOptions[i].addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('focus');
    })
}

//Payment info change event listener to show/hide appropriate payment div based on payment method selection
paymentMethod.addEventListener('change', (e) => {
    const paymentSelection = e.target.value;
    document.querySelector(`div[id="${paymentSelection}"]`).style.display = '';
    e.target.querySelector(`[value="${paymentSelection}"]`).setAttribute('selected', true);
    document.querySelectorAll(`fieldset[class="payment-methods"] > [id]:not([id="${paymentSelection}"])`)[0].style.display = 'none';
    e.target.querySelectorAll(`option:not([value="${paymentSelection}"])`)[1].removeAttribute('selected');
    document.querySelectorAll(`fieldset[class="payment-methods"] > [id]:not([id="${paymentSelection}"])`)[1].style.display = 'none';
    e.target.querySelectorAll(`option:not([value="${paymentSelection}"])`)[2].removeAttribute('selected');
});

/***
 * 'validator' function
 * returns true/false based on regex validation test
 * 
 * @param {Regexp} - The regex of for the field to be validated
 * @param {string} - The string to be validated by the regex
 * @return {Boolean} - Result of the regex validation
 ***/
function validator(regex, string) {
    return regex.test(string);
}

/***
 * 'textboxEventListener' function
 * Creates submit/keyup event listeners for all textboxes using the validationClass/validator/dynamicError functions
 * 
 * @param {Regexp} - The regex to be passed to the validator function
 * @param {element} - The textbox to be validated and to have class/hint applied to
 * @param {string} - The type of event. Either keyup or submit
 ***/
function textboxEventListener(regex, element, type) {
    const errorMessage = element.nextElementSibling.textContent;
    if (type === 'keyup') {
        element.addEventListener(`${type}`, (e) => {
            const value = element.value;
            validationClass(!validator(regex, value), element);
            if(!validator(regex, value)) {
                dynamicError(element, errorMessage);
            }      
        });
    } else {
        form.addEventListener(`${type}`, (e) => {
            const value = element.value;
            if(paymentMethod.value === 'credit-card' || element.id === 'email' || element.id === 'name') {
                validationClass(!validator(regex, value), element);
                if(!validator(regex, value)) {
                    e.preventDefault();
                    dynamicError(element, errorMessage);
                }    
            }  
        });
    }
}

/***
 * 'dynamicError' function
 * Creates/Shows dynamic error on all textboxes that have specific validation requirements
 * This can show either specific error or blank error
 * 
 * @param {element} - The textbox to apply the error message to
 * @param {errorMessage} - The initial error message from the html to be used when field is not blank
 ***/
function dynamicError (element, errorMessage) {
    const elementId = element.getAttribute('id');
    let blankErrorValue = elementId === 'cvv' ? 'CVV' :
                            elementId === 'zip' ? 'Zip Code' : 
                            elementId === 'cc-num' ? 'Credit card number' :
                            elementId === 'email' ? 'Email address' : '';
    element.nextElementSibling.innerHTML = element.value === '' && elementId !== 'name' ? `${blankErrorValue} field cannot be blank` : `${errorMessage}`;

}

/*** 
 * 'addValidationClass' function
 * Applies the appropriate class to the passed in element based on Boolean
 * 
 * @param {Boolean} - The result from the validator function
 * @param {element} - The element to apply class to
 ***/
function validationClass (isValid, element) {
    if(isValid) {
        element.parentElement.classList.add('not-valid');
        element.parentElement.classList.remove('valid');
        element.nextElementSibling.style.display = 'block';
    } else {
        element.parentElement.classList.remove('not-valid');
        element.parentElement.classList.add('valid');
        element.nextElementSibling.style.display = 'none';
    }
}

//Creating all keyup and submit event listeners for textboxes with helper functions 
textboxEventListener(cvvRegEx, cvv, 'keyup');
textboxEventListener(zipcodeRegEx, zipcode, 'keyup');
textboxEventListener(cardNumberRegEx, cardNumber, 'keyup');
textboxEventListener(emailRegEx, userEmail, 'keyup');
textboxEventListener(nameRegEx, userName, 'keyup');
textboxEventListener(cvvRegEx, cvv, 'submit');
textboxEventListener(zipcodeRegEx, zipcode, 'submit');
textboxEventListener(cardNumberRegEx, cardNumber, 'submit');
textboxEventListener(emailRegEx, userEmail, 'submit');
textboxEventListener(nameRegEx, userName, 'submit');