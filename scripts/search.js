import { updateCourses } from "./courses";

const searchForm = document.querySelector("nav form.nav__search");

export function setupSearch() {
  searchForm.addEventListener("submit", onFormSubmit);
}

function onFormSubmit(e) {
  e.preventDefault();
  updateCourses();
}
