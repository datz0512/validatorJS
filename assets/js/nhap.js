function Validator(options){
    var selectorRules = {}
    var formElement = document.querySelector(options.form)
    if(formElement){
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)  //Booleanq
                if(!isValid){
                    isFormValid = false;
                }
            })

            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        return (values[input.name] = input.value) && values
                    }, {});
                    options.onSubmit(formValues);
                }
                else{
                    formElement.submit()
                }
            }
        }

        options.rules.forEach(function(rule){

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector) // #fullname ,#email,...
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

            if(inputElement){
                inputElement.onblur = function(){
                    validate(inputElement, rule)
                }
                inputElement.oninput = function(){
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }

    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage 

        var rules = selectorRules[rule.selector]
        for(var i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
        return !errorMessage   // return Boolean
    }
}

Validator.isRequired = function(selector){
    return{
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui long nhap truong nay'
        }
    }
}

Validator.isEmail = function(selector, message){
    return{
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message
        }
    }
}

Validator.minLength = function(selector, min , message){
    return{
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message 
        }
    }
}

Validator({
    form: '#form-1',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'
            ,'Truong nay phai la email'),
        Validator.isRequired('#password'),
        Validator.minLength('#password', 6
            ,'Vui long nhap mat khau tren 6 ky tu'),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation', function(){
            return document.querySelector('#form-1 #password').value;
        }, 'Mat khau nhap lai khong chinh xac'),
    ],
    onSubmit: function(data){
        console.log(data)
    }
});