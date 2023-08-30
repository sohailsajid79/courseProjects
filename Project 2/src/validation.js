// email Validation
function isValidEmail(email, element) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    element.css("border", isValid ? "1px solid gray" : "1px solid red");
    return isValid;
  }
  
  // name Validation
  function isValidName(name, element) {
    const nameRegex = /^[a-zA-Z\s]*$/;
    nameRegex.test(name)
      ? element.css("border", "1px solid gray")
      : element.css("border", "1px solid red");
    return nameRegex.test(name);
  }
  
  // location Validation
  function isValidLocation(addLocation, element) {
    const nameRegex = /^[a-zA-Z\s]*$/;
    nameRegex.test(addLocation)
      ? element.css("border", "1px solid gray")
      : element.css("border", "1px solid red");
    return nameRegex.test(addLocation);
  }
  
  // department Validation
  function isValidDepartment(addDepartment, element) {
    const nameRegex = /^[a-zA-Z\s]*$/;
    nameRegex.test(addLocation)
      ? element.css("border", "1px solid gray")
      : element.css("border", "1px solid red");
    return nameRegex.test(addLocation);
  }