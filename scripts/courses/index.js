import { getActiveTab } from "./tabs";
export { setupTabs } from "./tabs";

const JSON_SERVER_URL = "http://localhost:3000";

const carouselState = {
  slide: 1,
  cardsCount: 4,
  courses: [],
};

const carouselBreakPoints = [
  { minWidth: 1300, cardsCount: 5 },
  { minWidth: 950, cardsCount: 4 },
  { minWidth: 750, cardsCount: 3 },
  { minWidth: 510, cardsCount: 2 },
  { minWidth: 480, cardsCount: 1 },
];

window.addEventListener("resize", setBreakPoint);

function setBreakPoint() {
  for (const breakPoint of carouselBreakPoints) {
    if (window.innerWidth >= breakPoint.minWidth) {
      setCardsCount(breakPoint.cardsCount);
      break;
    }
  }
}

setBreakPoint();

document
  .querySelector("#courses-carousel button.carousel-control-prev")
  .addEventListener("click", () => {
    console.log(carouselState);
    carouselState.slide--;
    carouselState.slide += carouselState.slidesCount;
    carouselState.slide %= carouselState.slidesCount;
  });

document
  .querySelector("#courses-carousel button.carousel-control-next")
  .addEventListener("click", () => {
    console.log(carouselState);
    carouselState.slide++;
    carouselState.slide %= carouselState.slidesCount;
  });

function setCardsCount(count) {
  const slide = Math.round(
    (carouselState.cardsCount * carouselState.slide) / carouselState.cardsCount
  );

  carouselState.cardsCount = count;
  // maxSlides -> 0 ... N - 1
  carouselState.slidesCount = Math.ceil(carouselState.courses.length / count);
  carouselState.slide = Math.min(carouselState.slidesCount - 1, slide);
  carouselState.slide = Math.max(carouselState.slide, 0);
  console.log(carouselState);
  renderCarousel();
}

export async function updateCourses() {
  const tab = getActiveTab();
  const query = getSearchQuery();
  const params = new URLSearchParams({ q: query, category: tab.category });
  const url = new URL(`/courses/?${params}`, JSON_SERVER_URL);
  const courses = await (await fetch(url)).json();
  carouselState.slide = 0;
  carouselState.courses = courses;
  setCardsCount(carouselState.cardsCount);
  renderCarousel();
}

function getSearchQuery() {
  const searchInput = document.querySelector("nav .nav-search input");
  return searchInput.value;
}

function renderCarousel() {
  const { cardsCount, slidesCount, courses, slide: activeSlide } = carouselState;
  const carousel = document.querySelector("#courses-carousel .carousel-inner");
  let markup = "";

  for (let slide = 0; slide < slidesCount; slide++) {
    markup += `
      <div class="carousel-item ${slide == activeSlide ? "active" : ""}">
        <div class="d-flex gap-3 px-2 justify-content-evenly">
    `;

    const indexLimit = Math.min(slide * cardsCount + cardsCount, courses.length);
    for (let i = slide * cardsCount; i < indexLimit; i++)
      markup += courseToMarkup(courses[i]);

    markup += `
        </div>
      </div>
    `;
  }

  carousel.innerHTML = markup;
}

function courseToMarkup(course) {
  const starsImage = new URL("../../assets/stars.jpg", import.meta.url);
  let price = `<span class="course-price">E£${course.price}</span>`;
  if (course.discountPrice)
    price = `
      <span>
        <span class="course-price">E£${course.discountPrice}</span>
        <span class="course-price-old">E£${course.price}</span>
      </span>
    `;
  let badges = "";
  if (course.badges)
    badges = course.badges
      .map((b) => `<span class="course-badge">${b}</span>`)
      .join("\n");
  return `
    <a class="course" href="#">
      <img class="course-img" src="${course.image}" alt="course cover" />
      <span class="course-title">${course.title}</span>
      <span class="text-small-lite">${course.instructors.map((i) => i.name).join()}</span>
        <span class="course-rating">
        <span class="course-rating-ratio">${course.rating.toFixed(1)}</span>
        <img class="course-rating-stars" alt="stars" src="${starsImage}" />
        <span class="text-small-lite">(2,916)</span>
      </span>
      ${price}
      <span class="course-badges">${badges}</span>
    </a>
  `;
}
