const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs"); // set EJS as view engine
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const url =
  "https://jiwaji.edu/notice-board-new-update-information-for-the-year-2024/";

async function fetchBENotices() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const notices = [];

    $("tr").each((i, el) => {
      const date = $(el).find("td").text().trim().slice(0, 11);
      $(el)
        .find("a")
        .each((i, a) => {
          const text = $(a).text();
          const href = $(a).attr("href");
          if (/B\.E\./i.test(text) || /Result/i.test(text)) {
            notices.push({ text, link: href, date });
          }
        });
    });

    return notices;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  }
}

// Route to render full HTML page
app.get("/", async (req, res) => {
  const notices = await fetchBENotices();
  res.render("Home", { notices }); // render index.ejs and pass notices
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
