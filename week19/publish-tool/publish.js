let http = require("http");
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process");
let querystring = require("querystring");

// 1、打开 https://github.com/login/oauth/authorize

// child_process.exec(
//     `start https://github.com/login/oauth/authorize?client_id=Iv1.d817878530be37ff`
// );

let request = http.request(
    {
        hostname: "127.0.0.1",
        port: 8082,
        method: "get",
        path: "publish/?token=" + 1111,
        // headers: {
        //     // "Content-Type": "application/octet-stream",
        //     // "Content-Length": stats.size,
        // },
    },
    (response) => {
        // console.log(response);
    }
);

// 3、创建server，接受token，后点击发布
function publish(token) {
    console.log(token);
    let request = http.request(
        {
            hostname: "127.0.0.1",
            port: 8082,
            method: "post",
            path: "publish/?token=" + token,
            headers: {
                // "Content-Type": "application/octet-stream",
                // "Content-Length": stats.size,
            },
        },
        (response) => {
            // console.log(response);
        }
    );
    // const archive = archiver("zip", {
    //     zlib: { level: 9 },
    // });

    // archive.directory("./sample/", false);

    // archive.finalize();

    // // archive.pipe(fs.createWriteStream("tmp.zip")); // 保存到本地文件
    // archive.pipe(request);
}

// http.createServer(function (request, response) {
//     console.log("3", request.url);
//     let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
//     publish(query.token);
// }).listen(8083);

// 获取文件大小之后
// fs.stat("./sample.html", (error, stats) => {
//     let request = http.request(
//         {
//             hostname: "127.0.0.1",
//             port: 8082,
//             method: "post",
//             headers: {
//                 "Content-Type": "application/octet-stream",
//                 "Content-Length": stats.size,
//             },
//         },
//         (response) => {
//             // console.log(response);
//         }
//     );

//     let file = fs.createReadStream("./sample.html");

//     file.pipe(request);
//     file.on("end", () => {
//         request.end();
//     });
// });

// file.on("data", (chunk) => {
//     console.log(chunk.toString());
//     request.write(chunk);
// });

// file.on("end", (chunk) => {
//     console.log("read finished");
//     request.end(chunk);
// });
