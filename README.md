# validatorJS

This is a JS library used in registration form written by myself.

## Installation

### Browser

```html
<script src="validator.js"></script>
```

## Basic Usage

```js
Validator({
    form: form,
    formGroupSelector: formGroup,
    errorSelector: formMessage,
    rules: rules
});
```
__form__ {Selector}  - The form you want to validate

__formGroup__ {Selector}  - The parent element of each input element

__formMessage__ {Selector}  - The element where error message is displayed

__rules__ {Array} - Validation rules

## Available Rules
Validation rules do not have an implicit 'required'. If a field is undefined or an empty string, it will pass validation. If you want a validation to fail for undefined or '', use the required rule.


### isRequired
```js
Validator.isRequired('#fullname')
// Check if this field is filled in or not
```

### isEmail
```js
Validator.isEmail('#email', 'This field must be email')
// Check whether this field is email or not
```

### minLength
```js
Validator.minLength('#password', 6, 'Please enter a password of more than 6 characters'),
// Check whether the password is more than 6 characters or not
```

### isConfirmed
```js
Validator.isConfirmed('#password_confirmation', 'Re-entered password is incorrect')
// check whether the re-entered password is correct or not
```

## Example
https://datz0512.github.io/validatorJS/
```html
<form action="" method="post" class="form" id="form-1">
        <div class="form-group">
            <label for="fullname" class="form-label">Fullname *</label>
            <input type="text" id="fullname" name="fullname" placeholder="VD: Đỗ Tiến Đạt" class="form-control">
            <span class="form-message"></span>
        </div>
</form>
```
```js
Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isEmail('#email' , 'This field must be email'),
        Validator.minLength('#password', 6, 'Please enter a password of more than 6 characters'),
        Validator.isConfirmed('#password_confirmation', 'Re-entered password is incorrect'),
    ],
    onSubmit: (data) => {
        console.log(data)
    }
});
```
You can see the API called in console.

