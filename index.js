
const myForm = {
  formEl: document.getElementById('myForm'),

  MAX_PHONE_SUM: 30,

  ERROR_CLASS_NAME: 'error',

  fields: ['fio', 'email', 'phone'],

  init() {
    this._setupEventListeners();
  },

  _setupEventListeners() {
    this.formEl.addEventListener('submit', this.submit.bind(this));
  },

  submit(e) {
    e.preventDefault();
    const url = e.target.attributes.action.value;

    const validateResult = this.validate();

    this._clearErrors();
    if ( !validateResult.isValid ) {
      return this._showErrors(validateResult.errorFields);
    }

    this._sendData(url);
  },

  _sendData(url) {
    const submitBtn = document.getElementById('submitButton');
    const resultContainer = document.getElementById('resultContainer');

    submitBtn.setAttribute('disabled', 'disabled');

    fetch(url, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(this.getData())
    })
      .then((res) => res.json())
      .then(data => {
        submitBtn.removeAttribute('disabled');

        switch (data.status) {
          case 'success':
            resultContainer.classList.add('success');
            resultContainer.innerText = 'success';
            return;
          case 'error':
            resultContainer.classList.add('error');
            resultContainer.innerText = data.reason;
            return;
          case 'progress':
            resultContainer.classList.add('progress');
            resultContainer.innerText = 'progress';
            setTimeout(() => {
              this._sendData(url);
            }, data.timeout);
            return;
        }
      })
  },

  validate() {
    const formData = this.getData();
    const errorFields = [];
    let isValid = true;

    this.fields.forEach((key) => {
      const pattern = this.formEl.elements[key].attributes.pattern.value;
      const fieldValue = formData[key];
      if (
          fieldValue.search(new RegExp(pattern, 'ig')) === -1 ||
          ( key === 'phone' && this._getSumFromPhoneNumber(fieldValue) > this.MAX_PHONE_SUM )
        ) {
        isValid = false;
        errorFields.push(key);
      }
    });

    return {
      isValid,
      errorFields
    }
  },

  getData() {
    const {
      fio,
      email,
      phone
    } = this.formEl.elements;

    return {
      fio: fio.value,
      email: email.value,
      phone: phone.value
    }
  },

  _getSumFromPhoneNumber(number) {
    return number.split('').reduce((prev, current) => {
      const num = Number(current);
      if ( isNaN(num) ) {
        return prev;
      } else {
        return prev + num;
      }
    }, 0);
  },

  _showErrors(errorFields) {
    const elements = this.formEl.elements;

    errorFields.forEach((errorField) => {
      elements[errorField].classList.add(this.ERROR_CLASS_NAME);
    });
  },

  _clearErrors() {
    const elements = this.formEl.elements;
    const resultContainer = document.getElementById('resultContainer');

    resultContainer.className = '';
    resultContainer.innerText = '';

    for( let el of elements ) {
      el.classList.remove(this.ERROR_CLASS_NAME);
    }
  },

  setData(data) {
    const elements = this.formEl.elements;

    this.fields.forEach((key) => {
      elements[key].value = data[key];
    })
  }
};

myForm.init();