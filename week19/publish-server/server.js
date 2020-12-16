let http = require("http");
let https = require("https");
let fs = require("fs");
let unzipper = require("unzipper");
let querystring = require("querystring");

// 2、auth路由：接受code，用client_id和client_secret换取token
function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    // console.log(query);
    getToken(query.code, function (info) {
        // console.log(info);
        // response.write(JSON.stringify(info));
        response.write(
            `<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`
        );
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request(
        {
            hostname: "github.com",
            path: `/login/oauth/access_token?code=${code}&client_id=Iv1.d817878530be37ff&client_secret=17f3514bc98c005f921353c0ff5b4e46a5c667ff`,
            port: 443,
            method: "POST",
        },
        function (response) {
            let body = "";

            response.on("data", (chunk) => {
                body += chunk.toString();
            });
            response.on("end", (chunk) => {
                callback(querystring.parse(body));
            });
        }
    );
    request.end();
}
// 4、publlish路由：用token获取用户信息，检查权限，接受发布
function publish(request, response) {
    console.log(4);
    let query = querystring.parse(
        request.url.match(/^\/publish\?([\s\S]+)$/)[1]
    );

    console.log(query);

    getUser(query.token, (info) => {
        if (info.login === "finder93cn") {
            request.pipe(unzipper.Extract({ path: "../server/public/" }));
            request.on("end", () => {
                response.end("Success");
            });
        }
    });
}

function getUser(token, callback) {
    let request = https.request(
        {
            hostname: "api.github.com",
            path: `/user`,
            port: 443,
            method: "get",
            headers: {
                Authorization: `token ${token}`,
                "User-Agent": "toy-publish-finder",
            },
        },
        function (response) {
            let body = "";

            response.on("data", (chunk) => {
                console.log(body);
                body += chunk.toString();
            });
            response.on("end", (chunk) => {
                console.log(body);
                callback(JSON.parse(body));
            });
        }
    );
    request.end();
}

http.createServer(function (request, response) {
    console.log(request.url);

    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }

    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }

    // let outFile = fs.createWriteStream("../server/public/tmp.zip");

    // request.pipe(outFile);

    // request.pipe(unzipper.Extract({ path: "../server/public/" }));

    // request.on("data", (chunk) => {
    //     // console.log(chunk.toString());
    //     outFile.write(chunk);
    // });
    // request.on("end", () => {
    //     // outFile.end();
    //     response.end("Success");
    // });
}).listen(8082);
