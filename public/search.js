document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    const query = searchInput.value.trim();
    const regex = new RegExp(`\\b${query}(th)?\\b`, "i"); // Match "iv" or "ivth", case-insensitive
    const items = document.querySelectorAll("ul li");

    let matchCount = 0;

    items.forEach((item) => {
      const text = item.innerText;
      if (regex.test(text)) {
        item.style.display = "block";
        matchCount++;
      } else {
        item.style.display = "none";
      }
    });

    if (matchCount === 0) {
      alert("No matching notices found.");

      // Show everything back after alert
      items.forEach((item) => {
        item.style.display = "block";
      });
    }
  });
});
