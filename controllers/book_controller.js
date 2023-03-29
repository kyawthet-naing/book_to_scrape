const axios = require("axios");
const cheerio = require("cheerio");
const response = require("../utils/response");

exports.get = async (req, res, next) => {
  try {
    let url = "https://books.toscrape.com/catalogue/page-1.html";
    let options = req.query;
    if (options.page != undefined) {
      url = `https://books.toscrape.com/catalogue/page-${options.page}.html`;
    }
    var result = await fetch(url);

    if (result == null) {
      response.throwError();
    }

    response.success(res, { message: "success", data: result });
  } catch (e) {
    next(e);
  }
};

let fetch = async (url) => {
  try {
    var result = await axios.get(url);
    var html = result.data;
    const $ = cheerio.load(html);
    const list = $("article", html);
    const nxtLink = $(".next a", html).attr("href");
    const preLink = $(".previous a", html).attr("href");

    var bookData = [];
    list.each((idx, e) => {
      var img = $("img", e);
      var title = $("h3 a", e);
      var price = $(".product_price .price_color", e);
      bookData.push({
        title: title.text(),
        price: price.text(),
        cover: "https://books.toscrape.com/" + img.attr("src").split("../")[1],
      });
    });
    return {
      prev_link:
        preLink == undefined
          ? null
          : `https://books.toscrape.com/catalogue/${preLink}`,
      current_link: url,
      next_link: `https://books.toscrape.com/catalogue/${nxtLink}`,
      data: bookData,
    };
  } catch (e) {
    return null;
  }
};
