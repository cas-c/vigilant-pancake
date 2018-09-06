const fs = require("graceful-fs");
let blogs;
const parser = require("xml2json");

fs.readdir("./blogs", async (err, items) => {
    blogs = items;
    blogs.forEach(blog => {
        try {
            fs.readFile("./blogs/" + blog, (err, data) => {
                if (!err) {
                    try {
                        const json = parser.toJson(data);

                        fs.writeFile(
                            "./out/" + blog + ".js",
                            "module.exports = " +
                                JSON.stringify(JSON.parse(json).Blog.post) +
                                ";",
                            err => {
                                if (err) throw err;
                                console.log("saved " + blog);
                            }
                        );
                    } catch (e) {
                        console.log(blog, " failed");
                    }
                }
            });
        } catch (e) {
            console.log(blog, " failed");
            return;
        }
    });
});
