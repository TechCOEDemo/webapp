# Simple Copilot prompts for a live demo

Run each prompt separately and inspect the diff after every change.

## 1. Understand the existing app
> Explain how this small leave request web app works. Describe the role of index.html, style.css, and app.js. Identify the main bugs or missing validation. Do not edit any files yet.

## 2. Improve the validation
> Improve the leave request form validation in app.js. Reject an end date earlier than the start date, trim the employee name, and show a helpful error message. Keep this a plain HTML/CSS/JavaScript app with no frameworks or package installation. Make the smallest change possible.

## 3. Add a useful feature
> Add a calculation showing the number of calendar days requested. Display it for each request in the recent requests list. Handle invalid date ranges and keep the existing visual style.

## 4. Review for security and quality
> Review this front-end app for bugs, accessibility issues, unsafe DOM manipulation, and maintainability. Explain the findings first and do not change files until I approve.

## 5. Improve the UI
> Improve the responsive layout and accessibility of this leave request app while keeping it simple and dependency-free. Do not introduce a JavaScript framework or build tools.

## Important live-demo note
The app is front-end only. Do not use real personal information. Data disappears when the page reloads and this app does not connect to HR systems.
