function Validator(options){
    var formElement = document.querySelector(options.form)
    if(formElement){
        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector)  // #fullname và #email
            if(inputElement){
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }
            }
        })
    }
    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector('.form-message')                
        var errorMessage = rule.test(inputElement.value)
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
    }
}

Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : "Vui long nhap truong nay"
        }
    };
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : "Vui long nhap truong nay"
        }
    };
}