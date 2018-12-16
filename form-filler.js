// ==UserScript==
// @name         Auto fill forms
// @namespace    https://github.com/twslade/Tampermonkey
// @version      0.1.1
// @description  Fill forms
// @author       Thomas Slade
// @match        https://*.local/*
// @updateURL    https://raw.githubusercontent.com/twslade/Tampermonkey/master/form-filler.js
// ==/UserScript==

(function($) {
    'use strict';
    $(document).ready(function(){
        var debug = false
        var getFormInputs = form => jQuery(form).find('input:visible, select:visible')
        var getVisibleForm = () => jQuery('form').filter((idx, form) => getFormInputs(form).length >= 3)[0]
        var log = (message) => {
            if(debug){
                console.log(message)
            }
        }
        var isCheckout = () => window.location.href.includes('checkout')

        if(getVisibleForm() || isCheckout()){
            log(`Form is ${getVisibleForm()}`)
            var button = document.createElement('button')
            button.style = 'position: fixed; top: 10px; left: 0; max-width: 100px; width: 100%; font-size: 12px; background-color: red; color: white; padding: 5px; z-index: 99999'
            button.innerText = 'Fill Form'
            button.addEventListener('click', fillForm)
            document.body.appendChild(button)
        }

        function fillForm(){
            log(`Filling form...`)
            var script = document.createElement('script');
            script.onload = function () {
                var formInputs = getFormInputs(getVisibleForm());
                log(`Form inputs are ${formInputs}`)

                var password = '123123'
                var firstname = faker.name.firstName()
                var lastname = faker.name.lastName()
                var customer = {
                    firstname: firstname,
                    lastname: lastname,
                    email: faker.internet.email(firstname, lastname),
                    password: password,
                    confirmation: password,
                    street: faker.address.streetAddress(),
                    city: faker.address.city(),
                    region: 54,
                    postcode: faker.address.zipCode(),
                    telephone: faker.phone.phoneNumber(),
                    cc_owner: firstname + ' ' + lastname,
                    cc_type: 'VI',
                    cc_number: '4111 1111 1111 1111',
                    cc_exp_year: '2028',
                    cc_cid: '123'
                }

                formInputs.each((idx, el) => {
                    var fieldName = el.name.toLowerCase()
                    for(var fieldKey in customer){
                        if(fieldName.includes(fieldKey)){
                            log(`Filling ${fieldName} with value: ${customer[fieldKey]}`)
                            jQuery('[name="' + fieldName + '"]').val(customer[fieldKey])
                        }
                    }
                })

            };
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.js'
            document.head.appendChild(script);
        }
    });
})(jQuery);