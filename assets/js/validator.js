 function Validator(options){
    var selectorRules = {}

    var formElement = document.querySelector(options.form)
    if(formElement){
        formElement.onsubmit = (e) => {
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if(!isValid){
                    isFormValid = false;
                }
            })

            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')){ 
                                    values[input.name] = [];
                                    return values
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value)

                                break;
                            case 'file':
                                values[input.name] = input.file;
                            default:
                                values[input.name] = input.value;
                        }
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }else{
                    formElement.submit()
                }
            }
        }

        options.rules.forEach((rule) => {

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
            var inputElements = formElement.querySelectorAll(rule.selector) 
            Array.from(inputElements).forEach((inputElement) => {
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }

                inputElement.oninput = () => {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }            
            })
        })
    }

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement
        }
    }

    function validate(inputElement, rule){
        var errorElement = getParent(inputElement, options.formGroupSelector)
                            .querySelector(options.errorSelector)
        var errorMessage 

        var rules = selectorRules[rule.selector]
        for(var i = 0; i < rules.length; ++i){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;
                default: 
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }else{
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage  
    }

}

Validator.isRequired = (selector) => {
    return{
        selector: selector,
        test: (value) => {
            return value ? undefined : 'Please enter this field'
        }
    }
}

Validator.isEmail = (selector, message) => {
    return{
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message
        }
    }
}

Validator.minLength = (selector, min , message) => {
    return{
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : message
        }
    }
}

Validator.isConfirmed = (selector, message) => {
    return{
        selector: selector,
        test: (value) => {
            return value === document.querySelector('#form-1 #password').value ? undefined : message 
        }
    }
}

Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email','This field must be email'),
        Validator.isRequired('#password'),
        Validator.minLength('#password', 6, 'Please enter a password of more than 6 characters'),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation', 'Re-entered password is incorrect'),
        // Validator.isRequired('#avatar'),
        Validator.isRequired('#province'),
        Validator.isRequired('input[name="gender"]'),
    ],
    onSubmit: (data) => {
        console.log(data)
    }
});






