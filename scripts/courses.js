const JSON_SERVER_URL = "http://localhost:3000";

const tabsContent = {
  python: {
    header: "Expand your career opportunities with Python",
    description:
      "Take one of Udemy’s range of Python courses and learn how to code using this incredibly useful language. Its simple syntax and readability makes Python perfect for Flask, Django, data science, and machine learning. You’ll learn how to build everything from games to sites to apps. Choose from a range of courses that will appeal to both beginners and advanced developers alike.",
  },
  aws: {
    header: "Become an expert in cloud computing with AWS Certification",
    description:
      "Prep for your AWS certification with an AWS course on Udemy. Learn the fundamentals of AWS such as working with a serverless platform, the various frameworks, security and more. With these courses, you’ll build the valuable skills you need to implement cloud initiatives — and open up new career opportunities. If you want to become an AWS developer, we’ve got the course for you.",
  },
  web: {
    header: "Build websites and applications with Web Development",
    description:
      "The world of web development is as wide as the internet itself. Much of our social and vocational lives play out on the internet, which prompts new industries aimed at creating, managing, and debugging the websites and applications that we increasingly rely on.",
  },
  javascript: {
    header: "Grow your software development skills with JavaScript",
    description:
      "JavaScript is a text-based computer programming language used to make dynamic web pages. A must-learn for aspiring web developers or programmers, JavaScript can be used for features like image carousels, displaying countdowns and timers, and playing media on a webpage. With JavaScript online classes, you can learn to build",
  },
  excel: {
    header: "Analyze and visualize data with Excel",
    description:
      "Take a Microsoft Excel course from Udemy, and learn how to use this industry-standard software. Real-world experts will show you the basics like how to organize data into sheets, rows and columns, and advanced techniques like creating complex dynamic formulas. Both small businesses and large companies use Excel to turn their raw data into actionable insights.",
  },
  drawing: {
    header: "Expand your creative skillset with Drawing",
    description:
      "Want to start drawing for fun or take your craft to the next level? Explore our online drawing classes and learn pencil drawing, figure drawing, cartoon drawing, character drawing for cartoons and anime, illustration, sketching, shading and more. Take an overview course on the fundamentals of drawing or zero in on an area you’d like to improve with a specialized course. We’ve got tons of options to get — and keep — you going.",
  },
  "data-science": {
    header: "Lead data-driven decisions with Data Science",
    description:
      "Data science application is an in-demand skill in many industries worldwide — including finance, transportation, education, manufacturing, human resources, and banking. Explore data science courses with Python, statistics, machine learning, and more to grow your knowledge. Get data science training if you’re into research, statistics, and analytics.",
  },
};

export function setupTabs() {
  const tabButtons = document.querySelectorAll(".tabs-buttons button");
  for (const btn of tabButtons) {
    btn.addEventListener("click", () => {
      for (const otherBtn of tabButtons) otherBtn.classList.remove("active");
      btn.classList.add("active");
      updateTab();
      updateCourses();
    });
  }
}

function updateTab() {
  const header = document.querySelector(".tabs-tab-header h2");
  const description = document.querySelector(".tabs-tab-header p");
  const exploreBtn = document.querySelector(".tabs-tab-header button");
  const tab = getActiveTab();
  header.innerText = tabsContent[tab.category].header;
  description.innerText = tabsContent[tab.category].description;
  exploreBtn.innerText = `Explore ${tab.title}`;
}

export async function updateCourses() {
  const tab = getActiveTab();
  const query = getSearchQuery();
  const params = new URLSearchParams({ q: query, category: tab.category });
  const url = new URL(`/courses/?${params}`, JSON_SERVER_URL);
  const courses = await (await fetch(url)).json();
  const carousel = document.querySelector(".courses-carousel");
  carousel.innerHTML = courses.map(courseToMarkup).join("\n");
}

function getActiveTab() {
  const tabButtons = document.querySelectorAll(".tabs-buttons button");
  for (const tabBtn of tabButtons) {
    if (tabBtn.classList.contains("active")) {
      return { title: tabBtn.innerText, category: tabBtn.dataset.category };
    }
  }
}

function getSearchQuery() {
  const searchInput = document.querySelector("nav .nav-search input");
  return searchInput.value;
}

function courseToMarkup(course) {
  const starsImage = new URL("../assets/stars.jpg", import.meta.url);
  let badges = "";
  let price = `<span class="course-price">E£${course.price}</span>`;
  if (course.badges)
    badges = course.badges.map((b) => `<span class="course-badge">${b}</span>`).join("\n");
  if (course.discountPrice)
    price = `
      <span>
        <span class="course-price">E£${course.discountPrice}</span>
        <span class="course-price-old">E£${course.price}</span>
      </span>
    `;
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
