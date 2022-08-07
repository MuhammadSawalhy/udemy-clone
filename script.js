const searchInput = document.querySelector("nav .nav__search input");
const searchBtn = document.querySelector("nav .nav__search button");

const setSearchBtnDisable = () => {
  const value = searchInput.value;
  console.log(value);
  if (!value) searchBtn.setAttribute("disabled", "disabled");
  else searchBtn.removeAttribute("disabled");
};

const onSearchChange = () => {
  setSearchBtnDisable();
  // if the change delayed a bit due to slow browser
  setTimeout(setSearchBtnDisable, 70);
};

searchInput.addEventListener("keyup", onSearchChange);
