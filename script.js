
const form = document.getElementById("enrollmentForm");
const courseSelect = document.getElementById("course");
const majorGroup = document.getElementById("majorGroup");
const majorSelect = document.getElementById("major");
const successMessage = document.getElementById("successMessage");
const tableBody = document.getElementById("studentTableBody");

// Show the major dropdown only when BSIT is selected.
courseSelect.addEventListener("change", () => {
    const isBSIT = courseSelect.value === "BSIT";

    majorGroup.hidden = !isBSIT;
    majorSelect.required = isBSIT;

    if (!isBSIT) {
        majorSelect.value = "";
        clearError("major");
    }

    clearError("course");
});

// Display an error message beside a field.
function showError(field, message) {
    document.getElementById(field + "Error").textContent = message;
    document.getElementById(field).classList.add("invalid");
    document.getElementById(field).setAttribute("aria-invalid", "true");
}

// Clear an individual field's error.
function clearError(field) {
    const input = document.getElementById(field);
    const error = document.getElementById(field + "Error");

    error.textContent = "";
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
}

// Validate one text field by its minimum length.
function validateLength(field, label, minLength, required) {
    const input = document.getElementById(field);
    const value = input.value.trim();

    if (required && value.length === 0) {
        showError(field, label + " is required.");
        return false;
    }

    if (value.length > 0 && value.length < minLength) {
        showError(
            field,
            label + " must be at least " + minLength + " characters."
        );
        return false;
    }

    clearError(field);
    return true;
}

// Validate the email format.
function validateEmail() {
    const email = document.getElementById("email");
    const value = email.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        showError("email", "Email address is required.");
        return false;
    }

    if (!emailPattern.test(value)) {
        showError("email", "Please enter a valid email address.");
        return false;
    }

    clearError("email");
    return true;
}

// Validate a dropdown.
function validateSelect(field, label) {
    const input = document.getElementById(field);

    if (!input.value) {
        showError(field, "Please select a " + label + ".");
        return false;
    }

    clearError(field);
    return true;
}

// Clear field errors while the user types or changes a value.
[
    "studentId",
    "prefix",
    "firstName",
    "middleName",
    "lastName",
    "suffix",
    "email",
    "course",
    "major",
    "yearLevel"
].forEach((field) => {
    const input = document.getElementById(field);
    const eventName = input.tagName === "SELECT" ? "change" : "input";

    input.addEventListener(eventName, () => {
        clearError(field);
        successMessage.hidden = true;
    });
});

// Validate the form and display submitted information.
form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    let isValid = true;

    if (!validateLength("studentId", "Student ID", 5, true)) {
        isValid = false;
    }

    if (!validateLength("prefix", "Prefix", 2, false)) {
        isValid = false;
    }

    if (!validateLength("firstName", "First name", 3, true)) {
        isValid = false;
    }

    if (!validateLength("middleName", "Middle name", 2, false)) {
        isValid = false;
    }

    if (!validateLength("lastName", "Last name", 2, true)) {
        isValid = false;
    }

    if (!validateLength("suffix", "Suffix", 2, false)) {
        isValid = false;
    }

    if (!validateEmail()) {
        isValid = false;
    }

    if (!validateSelect("course", "course")) {
        isValid = false;
    }

    if (courseSelect.value === "BSIT" &&
        !validateSelect("major", "major")) {
        isValid = false;
    }

    if (!validateSelect("yearLevel", "year level")) {
        isValid = false;
    }

    if (!isValid) {
        const firstInvalid = form.querySelector(".invalid");

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    // Get the student's information.
    const studentId = document.getElementById("studentId").value.trim();
    const prefix = document.getElementById("prefix").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const suffix = document.getElementById("suffix").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = courseSelect.value;
    const major = majorSelect.value;
    const yearLevel = document.getElementById("yearLevel").value;

    // Build the full name.
    const fullName = [
        prefix,
        firstName,
        middleName,
        lastName,
        suffix
    ].filter(Boolean).join(" ");

    const courseDisplay = course === "BSIT"
        ? course + " - " + major
        : course;

    // Remove the empty-state message.
    const emptyRow = document.getElementById("emptyRow");

    if (emptyRow) {
        emptyRow.remove();
    }

    // Use textContent to display user input safely.
    const row = document.createElement("tr");

    [
        studentId,
        fullName,
        email,
        courseDisplay,
        yearLevel
    ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    tableBody.appendChild(row);

    successMessage.textContent =
        "Enrollment submitted successfully!";
    successMessage.hidden = false;

    form.reset();
    majorGroup.hidden = true;
    majorSelect.required = false;

    document.querySelector(".table-card").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});