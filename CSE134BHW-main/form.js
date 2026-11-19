// Find Element
const form = document.querySelector("#contact-form");
const nameField = document.querySelector("#name");
const emailField = document.querySelector("#email");
const commentsField = document.querySelector("#comments");
const historyField = document.querySelector("#form-errors");
const errorArea = document.querySelector("#error-area");
const errorList = document.querySelector("#error-list");
const infoArea = document.querySelector("#info-area");
const countText = document.querySelector("#comments-count");
errorArea.hidden = false;
infoArea.hidden = false;

// Counter
const maxCharacters = commentsField.maxLength;
const warningAt = 100; 

function updateCount() {
	const remaining = maxCharacters - commentsField.value.length;
	if (remaining === 0) {
		countText.textContent = "Limit reached: you have used all " + maxCharacters + " characters.";
		infoArea.dataset.state = "limit";
	} 
    else if (remaining <= warningAt) {
		countText.textContent = "Warning: only " + remaining + " characters left.";
		infoArea.dataset.state = "warning";
	} 
    else {
		countText.textContent = remaining + " of " + maxCharacters + " characters remaining.";
		infoArea.dataset.state = "normal";
	}
}

commentsField.addEventListener("input", updateCount);
updateCount();

//Validate message
const labels = {
	name: "Name",
	email: "Email",
	comments: "Comments"
}

function checkField(field) {
	field.setCustomValidity("");

	let message = "";
	let code = "";

	if (field.validity.valueMissing) {
		code = "valueMissing";
		message = labels[field.id] + " is required.";
	} 
    else if (field.validity.typeMismatch) {
		code = "typeMismatch";
		message = "Enter an email address like name@example.com.";
	} 
    else if (field.validity.tooShort) {
		code = "tooShort";
		message = labels[field.id] + " needs at least " + field.minLength + " characters.";
	}

	if (message === "") {
		return null;
    }

	field.setCustomValidity(message);
	return { field: field.id, error: code, message: message };
}


//Error Area

function showError(field, problem) {
	const errorId = field.id + "-error";
	let item = document.getElementById(errorId);

    if (problem) {
		if (!item) {
			item = document.createElement("li");
			item.id = errorId;
			errorList.append(item);
		}
		item.textContent = labels[field.id] + ": " + problem.message;
		field.setAttribute("aria-describedby", field.id + "-hint " + errorId);
	} 
    else {
		if (item) {
			item.remove();
		}
		field.setAttribute("aria-describedby", field.id + "-hint");
	}
}

const editedFields = new Set();
const fields = [nameField, emailField, commentsField];

for (const field of fields) {
	field.addEventListener("input", function () {
		editedFields.add(field);
		const problem = checkField(field);
		if (document.getElementById(field.id + "-error")) {
			showError(field, problem);
		}
	});
	field.addEventListener("blur", function () {
		if (editedFields.has(field)) {
			showError(field, checkField(field));
		}
	});
}

// Error History
const form_errors = [];

let attemptNumber = 0;
let attemptInProgress = false;
const recordedThisAttempt = new Set();

form.addEventListener("invalid", function (event) {
	const field = event.target;
	if (!fields.includes(field)) {
		return;
	}
	if (!attemptInProgress) {
		attemptInProgress = true;
		attemptNumber = attemptNumber + 1;
		recordedThisAttempt.clear();
		setTimeout(function () {
			attemptInProgress = false;
		}, 0);
	}

	const problem = checkField(field);

	if (problem && !recordedThisAttempt.has(field.id)) {
		recordedThisAttempt.add(field.id);
		form_errors.push({
			attempt: attemptNumber,
			field: problem.field,
			error: problem.error,
			message: problem.message
		});
	}
	showError(field, problem);
}, true);

form.addEventListener("submit", function () {
	historyField.value = JSON.stringify(form_errors);
	historyField.disabled = false;
});