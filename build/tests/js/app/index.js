Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var WebDevServer = require("../../../lib/Server");
/**
 * @summary Exported class to handle directory requests.
 */
var App = /** @class */ (function (_super) {
    tslib_1.__extends(App, _super);
    /**
     * @summary Application constructor, which is executed only once,
     * 			when there is a request to directory with default `index.js`
     * 			script inside. Then it's automatically created an instance
     * 			of `module.exports` content. Then it's executed
     * 			`handleHttpRequest` method on that instance.
     * 			This is the way, how is directory request handled with
     * 			default `index.js` file inside.
     * 			If there is detected any file change inside this file
     * 			(or inside file included in this file), the module
     * 			`web-deb-server` automaticly reloads all necesssary
     * 			dependent source codes and creates this application
     * 			instance again. The same realoding procedure is executed,
     * 			if there is any unhandled error inside method
     * 			`handleHttpRequest` (to develop more comfortably).
     */
    function App(server, request, response) {
        var _this = _super.call(this, server) || this;
        /**
         * @summary Requests counter.
         * @var {number}
         */
        _this.counter = 0;
        return _this;
        // Any initializations:
    }
    /**
     * @summary This method is executed each request to directory with
     * 			`index.js` script inside (also executed for first time
     * 			immediately after constructor).
     * @public
     * @return {Promise<void>}
     */
    App.prototype.ServerHandler = function (request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sessionExists, sessionInitParam, session, sessionNamespace, staticHtmlFileFullPath, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // increase request counter:
                        this.counter++;
                        sessionExists = WebDevServer.Applications.Session.Exists(request);
                        sessionInitParam = request.GetParam('session_init', '\\d');
                        if (!!sessionExists) return [3 /*break*/, 2];
                        if (!sessionInitParam)
                            return [2 /*return*/, response.Redirect('?session_init=1')];
                        return [4 /*yield*/, WebDevServer.Applications.Session.Start(request, response)];
                    case 1:
                        (_a.sent()).GetNamespace("test").value = 0;
                        return [2 /*return*/, response.Redirect(request.GetRequestUrl())];
                    case 2: return [4 /*yield*/, WebDevServer.Applications.Session.Start(request, response)];
                    case 3:
                        session = _a.sent();
                        sessionNamespace = session.GetNamespace("test").SetExpirationSeconds(30);
                        sessionNamespace.value += 1;
                        staticHtmlFileFullPath = this.server.GetDocumentRoot() + "/src/tests/assets/index.html";
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                fs.readFile(staticHtmlFileFullPath, 'utf8', function (err, data) {
                                    // try to uncomment line bellow to see rendered error in browser:
                                    try {
                                        //throw new Error("Uncatched test error 2.");
                                    }
                                    catch (e) {
                                        err = e;
                                    }
                                    if (err)
                                        return reject(err);
                                    resolve(data);
                                });
                            })];
                    case 4:
                        data = _a.sent();
                        response.SetBody(data.replace(/%code%/g, JSON.stringify({
                            basePath: request.GetBasePath(),
                            path: request.GetPath(),
                            domainUrl: request.GetDomainUrl(),
                            baseUrl: request.GetBaseUrl(),
                            requestUrl: request.GetRequestUrl(),
                            fullUrl: request.GetFullUrl(),
                            params: request.GetParams(false, false),
                            appRequests: this.counter,
                            sessionTestValue: sessionNamespace.value
                        }, null, "\t"))).Send();
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}(WebDevServer.Applications.Abstract));
exports.default = App;
//# sourceMappingURL=index.js.map