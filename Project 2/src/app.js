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

  // reset add employee form
  $(".add-employee").click(function () {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#jobTitle").val("");
    $("#email").val("");
    getDepartments();
    $("#Employeelocation").val("Location");
  });
});

// get all employees
function getAllEmployee() {
  $.ajax({
    url: "Server/getAll.php",
    method: "GET",
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Employees not found!</h1>");
      }
    },
    error: function () {
      $("#employeeContainer").append("Error loading employees.");
    },
  });
}

//display employees
function displayEmlpoyees(employees) {
  $("#employeeContainer").html("");
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
            <a href="#addEmployeeModal" onclick="editEmployee('${employee.id}')" data-bs-toggle="modal" class="btn">
              <i class="fas fa-edit"></i>
            </a>
            <button class="btn" onclick="deleteEmployee('${employee.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `);
  });
}

// add new employee
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

//edit existing employee
function editEmployee(id) {
  $.ajax({
    url: "Server/getEmployeeByID.php",
    method: "GET",
    data: { id },
    success: function (response) {
      const data = response.data;
      if (response.status.code == 200 && data.hasOwnProperty("id")) {
        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#jobTitle").val(data.jobTitle);
        $("#email").val(data.email);
        $("#department option").each(function () {
          if ($(this).val() == data.departmentId) {
            $(this).prop("selected", true);
          }
        });
        $("#Employeelocation").append(`
          <option selected value="${data.locationId}">${data.location}</option>
        `);
        $("#save-employee").attr("onclick", `updateEmployee('${data.id}')`);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//update employee
function updateEmployee(employeeId) {
  const data = {
    id: employeeId,
    firstName: (firstName = $("#firstName").val()),
    lastName: (lastName = $("#lastName").val()),
    jobTitle: (jobTitle = $("#jobTitle").val()),
    email: (email = $("#email").val()),
    department: (department = $("#department").val()),
  };

  $.ajax({
    url: "Server/editEmployee.php",
    method: "POST",
    data: data,
    success: function (response) {
      if (response.status.code == 200) {
        $("#addEmployeeModal").modal("hide");
        getAllEmployee();
        swal.fire({
          title: "Updated!",
          icon: "success",
          text: "Employee has been updated!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: "Failed!",
          icon: "error",
          text: "Failed to updated employee!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    },
    error: function (error) {
      swal.fire({
        title: "Failed!",
        icon: "error",
        text: "Something went wrong!",
        timer: 3000,
        showConfirmButton: false,
      });
    },
  });
}

// delete employee
function deleteEmployee(employeeId) {
  showDeleteConfirmationModal(function () {
    $.ajax({
      url: "Server/deleteEmployee.php",
      method: "POST",
      data: {
        id: employeeId,
      },
      success: function (response) {
        if (response.status.code == 200) {
          swal.fire("Deleted", "Employee has been deleted!", "success");
          $("#employeeContainer").html("");
          getAllEmployee();
        } else {
          swal.fire("Failed!", "Failed to delete the employee.", "error");
        }
      },
      error: function (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Something went wrong!",
        });
      },
    });
  });
}

// get all departments from db
function getDepartments() {
  $.ajax({
    url: "Server/getAllDepartments.php",
    method: "GET",
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        setDepartments(response.data);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function setDepartments(departments) {
  $("#dropdown-menu-department").html("");
  $(".delete-departments").html("");
  $("#department").html("");
  $("#department").append(`
    <option value="" disabled selected>Select department</option>
  `);
  departments.forEach((department) => {
    $("#dropdown-menu-department").append(`
      <li class="d-flex align-content-center pe-3">
        <a onclick="filterByDepartment('${department.id}')" class="dropdown-item department-item">${department.name}</a> 
        <a class="edit-btn" onclick="editDepartment('${department.id}')" href="#" data-bs-toggle="modal" data-bs-target="#addDepartmentModal">
          <i class="fa-solid fa-pen-to-square"></i>
        </a>
      </li>
    `);

    $("#department").append(`
      <option value="${department.id}">${department.name}</option>
    `);

    $(".delete-departments").append(`
      <input
        class="form-check-input department-checkbox"
        type="checkbox"
        value="${department.id}"
        id="${department.id}"
      />
      <label class="form-check-label" for="${department.id}">
        ${department.name}
      </label>
      <br>
    `);
  });
}

//add new department
function createDepartment() {
  const department = $("#new-department").val();
  const location = $("#deptLocationID").val();

  if (department && location) {
    $.ajax({
      url: "Server/insertDepartment.php",
      method: "POST",
      data: {
        department,
        location,
      },
      success: function (response) {
        if (response.status.code == 200) {
          $("#addDepartmentModal").modal("hide");
          getDepartments();
          $("#deptLocationID").val("");
          swal.fire({
            title: "Created!",
            icon: "success",
            text: "Department has been created!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
}

//edit department
function editDepartment(id) {
  $.ajax({
    url: "Server/getDepartmentByID.php",
    method: "GET",
    data: { id },
    success: function (response) {
      const data = response.data;
      if (response.status.code == 200 && data.hasOwnProperty("id")) {
        $("#new-department").val(data.name);
        $("#deptLocationID option").each(function () {
          if ($(this).val() == data.locationId) {
            $(this).prop("selected", true);
          }
        });

        $("#save-department").attr("onclick", `updateDepartment('${data.id}')`);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function updateDepartment(departmentId) {
  const department = $("#new-department").val();
  const location = $("#deptLocationID").val();

  if (location !== "" && department !== "") {
    $.ajax({
      url: "Server/editDepartment.php",
      method: "POST",
      data: {
        id: departmentId,
        name: department,
        location: location,
      },
      success: function (response) {
        if (response.status.code == 200) {
          getDepartments();
          $("#addDepartmentModal").modal("hide");
          swal.fire({
            title: "Updated!",
            icon: "success",
            text: "Department has been updated!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          swal.fire({
            title: "Failed!",
            icon: "error",
            text: "Failed to updated department!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      error: function (error) {
        swal.fire({
          title: "Failed!",
          icon: "error",
          text: "Something went wrong!",
          timer: 3000,
          showConfirmButton: false,
        });
      },
    });
  }
}

// delete department
function deleteDepartment() {
  var selectedDepartments = [];
  $(".department-checkbox:checked").each(function (index, checkbox) {
    var value = $(checkbox).val();
    selectedDepartments.push(value);
  });
  if (selectedDepartments.length > 0) {
    showDeleteConfirmationModal(function () {
      $.ajax({
        url: "Server/deleteDepartmentByID.php",
        method: "POST",
        data: {
          departments: selectedDepartments,
        },
        success: function (response) {
          if (response.status.code == 200) {
            getAllEmployee();
            getDepartments();
            $("#deleteDepartmentModal").modal("hide");
            Swal.fire(
              "Success",
              "Selected departments are deleted!",
              "success"
            );
          } else if (response.status.code == 409) {
            $("#deleteDepartmentModal").modal("hide");
            Swal.fire(
              "Warning",
              "You can't delete location it's accociated with some department!",
              "warning"
            );
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  } else {
    Swal.fire("Select department first", "warn");
  }
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

// get all locations from db
function getLocations() {
  $.ajax({
    url: "Server/getAllLocation.php",
    method: "GET",
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        setLocations(response.data);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function setLocations(locations) {
  $("#dropdown-menu-location").html("");
  $("#deptLocationID").html("");
  $(".delete-locations").html("");

  locations.forEach((location) => {
    $("#dropdown-menu-location").append(`
      <li class="d-flex align-content-center pe-3">
        <a onclick="filterByLocation('${location.id}')" class="dropdown-item department-item">${location.name}</a> 
        <a class="edit-btn" onclick="editLocation('${location.id}')" href="#" data-bs-toggle="modal" data-bs-target="#addLocationModal">
          <i class="fa-solid fa-pen-to-square"></i>
        </a>
      </li>
    `);

    $("#deptLocationID").append(`
      <option value="${location.id}">${location.name}</option>
    `);

    $(".delete-locations").append(`
      <input
        class="form-check-input location-checkbox"
        type="checkbox"
        value="${location.id}"
        id="${location.id}"
      />
      <label class="form-check-label" for="${location.id}">
        ${location.name}
      </label>
      <br>
    `);
  });
}

// add new location
function createLocation() {
  const location = $("#addLocation").val();
  if (location) {
    $.ajax({
      url: "Server/insertLocation.php",
      method: "POST",
      data: { location },
      success: function (response) {
        if (response.status.code == 200) {
          $("#addLocationModal").modal("hide");
          $("#addLocation").val("");
          getLocations();
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "New Location Added To Directory",
            showConfirmButton: false,
            timer: 2500,
          });
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } else {
    $("#addLocation").css("border", "1px solid red");
  }
}

//edit location
function editLocation(id) {
  $.ajax({
    url: "Server/getLocationByID.php",
    method: "GET",
    data: { id },
    success: function (response) {
      const data = response.data;
      console.log(data);
      if (response.status.code == 200 && data.hasOwnProperty("id")) {
        $("#addLocation").val(data.name);
        $("#save-location").attr("onclick", `updateLocation('${data.id}')`);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function updateLocation(locationId) {
  const location = $("#addLocation").val();
  if (location !== "") {
    $("#addLocation").css("border", "1px solid gray");
    $.ajax({
      url: "Server/editLocation.php",
      method: "POST",
      data: {
        id: locationId,
        name: location,
      },
      success: function (response) {
        if (response.status.code == 200) {
          getLocations();
          $("#addLocationModal").modal("hide");
          swal.fire({
            title: "Updated!",
            icon: "success",
            text: "Location has been updated!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          swal.fire({
            title: "Failed!",
            icon: "error",
            text: "Failed to updated location!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      error: function (error) {
        swal.fire({
          title: "Failed!",
          icon: "error",
          text: "Something went wrong!",
          timer: 3000,
          showConfirmButton: false,
        });
      },
    });
  } else {
    $("#addLocation").css("border", "1px solid red");
  }
}

//delete location
function deleteLocation() {
  var selectedLocations = [];
  $(".location-checkbox:checked").each(function (index, checkbox) {
    var value = $(checkbox).val();
    selectedLocations.push(value);
  });

  if (selectedLocations.length > 0) {
    showDeleteConfirmationModal(function () {
      $.ajax({
        url: "Server/deleteLocationByID.php",
        method: "POST",
        data: {
          locations: selectedLocations,
        },
        success: function (response) {
          if (response.status.code == 200) {
            getAllEmployee();
            getDepartments();
            getLocations();
            $("#deleteLocationModal").modal("hide");
            Swal.fire("Success", "Selected locations are deleted!", "success");
          } else if (response.status.code == 409) {
            $("#deleteLocationModal").modal("hide");
            Swal.fire(
              "Warning",
              "You can't delete location it's accociated with some department!",
              "warning"
            );
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  } else {
    Swal.fire("Select department first", "warn");
  }
}

function showDeleteConfirmationModal(callbak) {
  const confirmationModal = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mr-2",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  confirmationModal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this change",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        callbak();
      }
    });
}

// filter employee department
function filterByDepartment(id) {
  $.ajax({
    url: "Server/filterByDepartment.php",
    method: "GET",
    data: { id },
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Employees not found!</h1>");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}
// filter employee by location
function filterByLocation(id) {
  $.ajax({
    url: "Server/filterByLocation.php",
    method: "GET",
    data: { id },
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Employees not found!</h1>");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// search by firstName and lastName
function filterByName(event) {
  event.preventDefault();
  const keyword = $("#keyword").val();
  $.ajax({
    url: "Server/getPersonnelByName.php",
    method: "GET",
    data: { keyword },
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Not found!</h1>");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

$(".add-employee").click(function () {
  $("#save-employee").attr("onclick", "createEmployee()");
});
$(".add-department").click(function () {
  $("#save-department").attr("onclick", "createDepartment()");
});
$(".add-location").click(function () {
  $("#save-location").attr("onclick", "createLocation()");
});
