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
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 10000, // 10 seconds timeout so it doesn’t hang
    });

    const $ = cheerio.load(data);
    const notices = [];

    $("tr").each((i, el) => {
      const date = $(el).find("td").text().trim().slice(0, 11);
      $(el)
        .find("a")
        .each((i, a) => {
          const text = $(a).text();
          const href = $(a).attr("href");

          if (
            /B\.E\./i.test(text) ||
            /\b(Result)\b/.test(text) ||
            /\b(RESULT)\b/.test(text)
          ) {
            notices.push({ text, link: href, date });
          }
        });
    });

    // console.log("Fetched notices:", notices.length);
    return notices;
  } catch (error) {
    console.error("Error fetching notices:", error.message);
    return [];
  }
}

// fetchBENotices();
// Route to render full HTML page
app.get("/", async (req, res) => {
  const notices = await fetchBENotices();
  res.render("Home", { notices }); // render index.ejs and pass notices
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
