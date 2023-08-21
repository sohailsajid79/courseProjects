//preloader
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(0)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

$(document).ready(function () {
  getAllEmployee();
  getDepartments();
  getLocations();
});

// get All Employees From DB
function getAllEmployee() {
  $.ajax({
    url: "Server/getAll.php",
    method: "GET",
    success: function (response) {
      if (response.data && Array.isArray(response.data)) {
        const employees = response.data;

        if (employees.length > 0) {
          // Check if employees array is not empty
          employees.forEach((employee) => {
            $("#employeeContainer").append(`
          <div class="col mb-4">
            <div class="card" style="width: 20rem">
              <div class="card-body">
                <h1 class="firstName">${employee.firstName}</h1>
                <h1 class="lastName">${employee.lastName}</h1>
                <p class="jobTitle"></p>
                <p class="department">
                  <i class="fa-solid fa-building"></i> ${employee.department}
                </p>
                <p class="location">
                  <i class="fa-solid fa-globe"></i>
                  ${employee.location}
                </p>
                <p class="email">
                  <i class="fa-solid fa-envelope"></i>
                  ${employee.email}
                </p>
              </div>
              <div class="card-footer">
                <button class="btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn" onclick="showDeleteConfirmationModal('${employee.id}')">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `);
          });
        } else {
          $("#employeeContainer").html("No employees found");
        }
      }
    },
    error: function () {
      $("#employeeContainer").append("Error loading employees.");
    },
  });
}

// get All Departments From DB
// append To Dropdown Menu
// append To Department Dropdown In 'Add Employee Form'
function getDepartments() {
  $.ajax({
    url: "Server/getAllDepartments.php",
    method: "GET",
    success: function (response) {
      const departments = response.data;
      const dropdownMenuDepartment = $("#dropdown-menu-department");
      const dropdownDepartment = $("#department");

      if (departments.length > 0) {
        departments.forEach(function (department) {
          // append to the dropdown nav menu
          const listItem = $(
            '<li><a class="dropdown-item" href="#">' +
              department.name +
              "</a></li>"
          );
          dropdownMenuDepartment.append(listItem);

          // append to the 'add employee form'
          const option = $("<option></option>");
          option.attr("value", department.id);
          option.text(department.name);
          dropdownDepartment.append(option);
        });
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// get All Locations From DB
// append To Dropdown Menu
// append Dropdown To 'Add Department Modal'
function getLocations() {
  $.ajax({
    url: "Server/getAllLocation.php",
    method: "GET",
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        const locations = response.data;
        const dropdownLocation = $("#dropdown-menu-location");
        const selectLocation = $("#location");

        locations.forEach(function (location) {
          const listItem = $(
            '<li><a class="dropdown-item" href="#">' +
              location.name +
              "</a></li>"
          );
          dropdownLocation.append(listItem);

          const option = $("<option>", {
            value: location.id,
            text: location.name,
          });
          selectLocation.append(option);
        });
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// delete Employee From Directory & DB
function deleteEmployee(employeeId, swal) {
  $.ajax({
    url: "Server/deleteEmployee.php",
    method: "POST",
    data: {
      ID: employeeId,
    },
    success: function (response) {
      console.log(response);
      if (response.status.code == 200) {
        swal.fire(
          "Deleted",
          "User has been removed from the directory",
          "success"
        );
        $("#employeeContainer").html("");
        getAllEmployee();
      } else {
        swal.fire("Failed!", "Failed to delete the employee.", "error");
      }
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong",
      });
    },
  });
}

// delete Confirmation Modal For Empployee
function showDeleteConfirmationModal(employeeId) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this change",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(employeeId, swalWithBootstrapButtons);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Request was cancelled");
      }
    });
}

// affiliate Department with locationID Inside 'Add Employee Card Form'
async function departmentOnChange() {
  const deptId = $("#department").val();
  const res = await fetch("Server/getAllDepartments.php");
  const result = await res.json();
  const { locationID, location } = result.data.find(
    (department) => department.id == deptId
  );
  option = `<option selected value="${locationID}">${location}</option>`;
  $("#Employeelocation").html(`<option disabled selected>Location</option>`);
  $("#Employeelocation").append(option);
}

// create Employee Card And Insert Into DB
function createEmployee() {
  const firstName = $.trim($("#firstName").val());
  const lastName = $.trim($("#lastName").val());
  const jobTitle = $.trim($("#jobTitle").val());
  const email = $("#email").val().trim();
  const department = $("#department").val();
  const location = $("#Employeelocation").val();

  const data = {
    firstName,
    lastName,
    jobTitle,
    email,
    departmentID: department,
  };

  if (
    isValidName(firstName, $("#firstName")) &
    isValidName(lastName, $("#lastName")) &
    isValidName(jobTitle, $("#jobTitle")) &
    isValidEmail(email, $("#email")) &
    (department !== "") &
    (location !== "")
  ) {
    $.ajax({
      url: "Server/insertEmployee.php",
      method: "POST",
      data: data,
      success: function (response) {
        if (response.status.code == 200) {
          $("#addEmployeeModal").modal("hide");
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "Employee Added to Directory",
            showConfirmButton: false,
            timer: 2500,
          });
          // Clear form inputs
          $("#firstName").val("");
          $("#lastName").val("");
          $("#jobTitle").val("");
          $("#email").val("");
          $("#department").val(""); // Reset department selection
          $("#Employeelocation").val(""); // Reset location selection
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid",
      text: "Check For Errors",
    });
  }
}

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

// create Add Department, Insert Into DB & Menu Bar ****
function createDepartment() {
  const addDepartment = $.trim($("#NewDepartment").val());
  const data = { addDepartment, deptLocationID };
  if (isValidDepartment($("#addDepartment"))) {
    $.ajax({
      url: "Server/insertDepartment.php",
      method: "POST",
      data: data,
      success: function (response) {
        console.log(response);
        if (response.status.code == 200) {
          $("#addDepartment").modal("hide");
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "New Location Added To Directory",
            showConfirmButton: false,
            timer: 2500,
          });
          // Clear form inputs
          $("#addDepartment").val("");
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid",
      text: "Check For Errors",
    });
  }
}

// create New Location, Insert Into DB & Menu Bar ****
function createLocation() {
  const addLocation = $.trim($("#addLocation").val());
  const data = { addLocation };
  if (isValidLocation(location, $("#addLocation"))) {
    $.ajax({
      url: "Server/insertLocation.php",
      method: "POST",
      data: data,
      success: function (response) {
        console.log(response);
        if (response.status.code == 200) {
          $("#addLocation").modal("hide");
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "New Location Added To Directory",
            showConfirmButton: false,
            timer: 2500,
          });
          // Clear form inputs
          $("#addLocation").val("");
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid",
      text: "Check For Errors",
    });
  }
}

// edit Employee
// edit Department
// edit location

// delete Department From Directory & DB,
function deleteDepartment() {}
// delete Confirmation Modal For Department
function showDeleteConfirmationModalDepartment() {}

// delete Location From Directory & DB,
function deleteLocation() {}
// delete Confirmation Modal For Location
function showDeleteConfirmationModaLocation() {}

// filter Personnel By DepartmentID
// filter Personnel By LocationID
// filter Personnel By PersonnelID - search bar
