// Simple starter implementation. Ask Copilot to modernise this incrementally.
const form = document.getElementById("leave-form");
const message = document.getElementById("message");
const requestList = document.getElementById("request-list");
const requestCount = document.getElementById("request-count");
const statusFilter = document.getElementById("status-filter");
const balance = document.getElementById("balance");
const approverInput = document.getElementById("approver");

const requests = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const employee = document.getElementById("employee").value;
  const leaveType = document.getElementById("leave-type").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const reason = document.getElementById("reason").value;
  const approver = approverInput ? approverInput.value : "";

  if (employee.trim() === "") {
    message.textContent = "Please enter the employee name.";
    return;
  }

  if (approverInput && approver.trim() === "") {
    message.textContent = "Please enter the approver name.";
    return;
  }

  if (leaveType.trim() === "") {
    message.textContent = "Please select a leave type.";
    return;
  }

  if (startDate.trim() === "") {
    message.textContent = "Please select a start date.";
    return;
  }

  if (endDate.trim() === "") {
    message.textContent = "Please select an end date.";
    return;
  }

  if (reason.trim() === "") {
    message.textContent = "Please enter a reason for the leave request.";
    return;
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(value + "T00:00:00Z");
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    message.textContent = "Please enter valid start and end dates.";
    return;
  }

  if (endDate < startDate) {
    message.textContent = "The end date cannot be before the start date.";
    return;
  }

  const request = {
    employee: employee,
    approver: approver,
    leaveType: leaveType,
    startDate: startDate,
    endDate: endDate,
    reason: reason,
    status: "Pending"
  };

  requests.push(request);
  requestCount.textContent = requests.length;
  message.textContent = "Leave request submitted.";
  form.reset();
  renderRequests();
  calculateLeaveBalance();
});

statusFilter.addEventListener("change", renderRequests);

function renderRequests() {
  requestList.innerHTML = "";
  const visibleRequests = requests.filter(function (request) {
    return statusFilter.value === "All" || request.status === statusFilter.value;
  });

  if (visibleRequests.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No matching requests.";
    requestList.appendChild(empty);
    return;
  }

  visibleRequests.forEach(function (request) {
    const item = document.createElement("li");
    item.className = "request-item";

    const title = document.createElement("strong");
    title.textContent = request.employee + " — " + request.leaveType + " leave";

    const meta = document.createElement("div");
    meta.className = "request-meta";
    const approverText = request.approver ? " | Approver: " + request.approver : "";
    meta.textContent = request.startDate + " to " + request.endDate + approverText;

    const status = document.createElement("span");
    status.className = "status " + request.status.toLowerCase();
    status.textContent = request.status;

    const actions = document.createElement("div");
    actions.className = "request-actions";

    if (request.status === "Pending") {
      const approveButton = document.createElement("button");
      approveButton.type = "button";
      approveButton.textContent = "Approve";
      approveButton.className = "approve-btn";
      approveButton.addEventListener("click", function () {
        updateRequestStatus(requests.indexOf(request), "Approved");
      });

      const rejectButton = document.createElement("button");
      rejectButton.type = "button";
      rejectButton.textContent = "Reject";
      rejectButton.className = "reject-btn";
      rejectButton.addEventListener("click", function () {
        updateRequestStatus(requests.indexOf(request), "Rejected");
      });

      actions.appendChild(approveButton);
      actions.appendChild(rejectButton);
    }

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(status);
    item.appendChild(actions);
    requestList.appendChild(item);
  });
}

function calculateLeaveBalance() {
  const usedDaysByEmployee = new Map();

  requests.forEach(function (request) {
    if (!usedDaysByEmployee.has(request.employee)) {
      usedDaysByEmployee.set(request.employee, 0);
    }

    if (request.status === "Approved" && request.leaveType === "Annual") {
      const start = new Date(request.startDate + "T00:00:00Z");
      const end = new Date(request.endDate + "T00:00:00Z");
      const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      usedDaysByEmployee.set(
        request.employee,
        usedDaysByEmployee.get(request.employee) + diffDays
      );
    }
  });

  if (usedDaysByEmployee.size === 0) {
    balance.textContent = "Annual Leave Balance: 30 days";
    return;
  }

  balance.textContent = Array.from(usedDaysByEmployee, function ([employee, usedDays]) {
    return employee + " — Annual Leave Balance: " + (30 - usedDays) + " days";
  }).join("\n");
}

function updateRequestStatus(index, newStatus) {
  if (index < 0 || index >= requests.length) {
    return;
  }

  requests[index].status = newStatus;
  message.textContent = "Leave request for " + requests[index].employee + " was " + newStatus.toLowerCase() + ".";
  renderRequests();
  calculateLeaveBalance();
}  