// preloader
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
  getAllEmployees();
  getDepartments();
  getLocations();

  // reset Add Employee Form
  $(".add-employee").click(function () {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#jobTitle").val("");
    $("#email").val("");
    getDepartments();
    $("#Employeelocation").val("Location");
  });
});

// get All Employees From DB And Append to Directory
function getAllEmployees() {
  $.ajax({
    url: "Server/getAll.php",
    method: "GET",
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Employees not found</h1>");
      }
    },
    error: function () {
      $("#employeeContainer").append("Error loading employees.");
    },
  });
}

// display Employees Card
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

// add New Employee Card
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
          // clear Form Inputs
          $("#firstName").val("");
          $("#lastName").val("");
          $("#jobTitle").val("");
          $("#email").val("");
          $("#department").val(""); // reset Department Selection
          $("#Employeelocation").val(""); // reset Location Selection
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

// edit Existing Employee
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
      console.log(error.responseText);
    },
  });
}

// update Employee Card
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
        getAllEmployees();
        swal.fire({
          title: "Updated!",
          icon: "success",
          text: "Employee Has Been Update",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: "Failed!",
          icon: "error",
          text: "Failed To Update Employee",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    },
    error: function (error) {
      swal.fire({
        title: "Failed!",
        icon: "error",
        text: "Something Went Wrong",
        timer: 3000,
        showConfirmButton: false,
      });
    },
  });
}

// delete Employee Card
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
          swal.fire("Deleted", "Employee Has Been Deleted", "success");
          $("#employeeContainer").html("");
          getAllEmployees();
        } else {
          swal.fire("Failed!", "Failed To Delete The Employee.", "error");
        }
      },
      error: function (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Something Went Wrong",
        });
      },
    });
  });
}

// get All Departments From DB
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

// add New department
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
            text: "Department Has Been Created",
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

// edit Department
function editDepartment(id) {
  $.ajax({
    url: "Server/getDepartmentByID.php",
    method: "GET",
    data: { id },
    success: function (response) {
      console.log(response);
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
      console.log(error.responseText);
    },
  });
}

// update Department
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
            text: "Department Has Been Updated",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          swal.fire({
            title: "Failed!",
            icon: "error",
            text: "Failed To Update Department",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      error: function (error) {
        swal.fire({
          title: "Failed!",
          icon: "error",
          text: "Something Went Wrong!",
          timer: 3000,
          showConfirmButton: false,
        });
      },
    });
  }
}

// delete Department
function deleteDepartment() {
  let selectedDepartments = [];
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
            getAllEmployees();
            getDepartments();
            $("#deleteDepartmentModal").modal("hide");
            Swal.fire(
              "Success",
              "Selected Department (s) Are Deleted",
              "success"
            );
          }
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  } else {
    Swal.fire("Select Department First", "warn");
  }
}

// affiliate Department With locationID Inside 'Add Employee Card Form'
async function departmentOnChange() {
  console.log("change");
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

// get All Locations From DB
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

// add New Location
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
        console.log(error.responseText);
      },
    });
  } else {
    $("#addLocation").css("border", "1px solid red");
  }
}

// edit Location
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
      console.log(error.responseText);
    },
  });
}

// update Location
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
            text: "Location Has Been Updated",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          swal.fire({
            title: "Failed!",
            icon: "error",
            text: "Failed To Update Location",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      error: function (error) {
        swal.fire({
          title: "Failed!",
          icon: "error",
          text: "Something Went Wrong!",
          timer: 3000,
          showConfirmButton: false,
        });
      },
    });
  } else {
    $("#addLocation").css("border", "1px solid red");
  }
}

// delete Location
function deleteLocation() {
  var selectedLocations = [];
  $(".location-checkbox:checked").each(function (index, checkbox) {
    var value = $(checkbox).val();
    selectedLocations.push(value);
  });
  console.log(selectedLocations);
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
            getAllEmployees();
            getDepartments();
            getLocations();
            $("#deleteLocationModal").modal("hide");
            Swal.fire(
              "Success",
              "Selected Location (s) Are Deleted",
              "success"
            );
          }
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  } else {
    Swal.fire("Select Department First", "warn");
  }
}

// delete Confirmation Modal
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
      text: "You Won't Be Able To Revert This Change",
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

// filter Employee Department
function filterByDepartment(id) {
  $.ajax({
    url: "Server/filterByDepartment.php",
    method: "GET",
    data: { id },
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Employees not found</h1>");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}
// filter Employee By Location
function filterByLocation(id) {
  $.ajax({
    url: "Server/filterByLocation.php",
    method: "GET",
    data: { id },
    success: function (response) {
      if (response.status.code == 200 && response.data.length > 0) {
        displayEmlpoyees(response.data);
      } else {
        $("#employeeContainer").html("<h1>Employees not found</h1>");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// search By FirstName and LastName
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
        $("#employeeContainer").html("<h1>Not found</h1>");
      }
    },
    error: function (error) {
      console.log(error.responseText);
    },
  });
}

// onclick Event Handlers
$(".add-employee").click(function () {
  $("#save-employee").attr("onclick", "createEmployee()");
});
$(".add-department").click(function () {
  $("#save-department").attr("onclick", "createDepartment()");
});
$(".add-location").click(function () {
  $("#save-location").attr("onclick", "createLocation()");
});
