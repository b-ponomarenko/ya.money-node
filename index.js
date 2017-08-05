const app = {
  form: document.getElementById('myForm'),

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.form.addEventListener('submit', this.submit.bind(this));
  },

  submit(e) {
    e.preventDefault();
    const url = e.target.attributes.action.value;

    const validateResult = this.validate();

    if ( !validateResult.isValid ) {
      return;
    }

    // fetch(url, {
    // })
  },

  validate() {
    const form = this.getData();
    const errorFields = [];



    return {
      isValid: true,
      errorFields
    }
  },

  getData() {
    const {
      fio,
      email,
      phone
    } = this.form.elements;

    return {
      fio: fio.value,
      email: email.value,
      phone: phone.value
    }
  }
};

app.init();