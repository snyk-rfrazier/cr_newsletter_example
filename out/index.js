"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var snykApiUrl = 'https://api.snyk.io/rest/';
var snykAuthToken = '1d9595af-4811-4681-87a4-75a3cf25a65d'; // Replace with your Snyk API token
var version = "2024-06-21";
var getOrgData = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var snykUrl, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                snykUrl = new URL('orgs', snykApiUrl);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(snykUrl.toString(), {
                        headers: {
                            Authorization: "Token ".concat(snykAuthToken),
                        },
                        params: {
                            version: version,
                            limit: 100,
                            group_id: '93a4aa4c-8de1-4acb-af74-4ef28e0d2668',
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data.data.map(function (org) {
                        return {
                            "id": org.id,
                            "name": org.attributes.name,
                        };
                    })];
            case 3:
                error_1 = _a.sent();
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getIssuesByOrg = function (org_1, cursor_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([org_1, cursor_1], args_1, true), void 0, function (org, cursor, allIssues) {
        var snykUrl, params, response, issues, links, url, nextCursor, error_2;
        if (allIssues === void 0) { allIssues = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    snykUrl = new URL("orgs/".concat(org.id, "/issues"), snykApiUrl);
                    params = {
                        version: version,
                        limit: 100,
                        status: "open",
                    };
                    if (cursor) {
                        params['starting_after'] = cursor;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.get(snykUrl.toString(), {
                            headers: {
                                Authorization: "Token ".concat(snykAuthToken),
                            },
                            params: params,
                        })];
                case 2:
                    response = _a.sent();
                    issues = [];
                    issues = response.data.data.map(function (issue) {
                        var _a;
                        return ({
                            orgId: org.id,
                            orgName: org.name,
                            severity: (_a = issue.attributes) === null || _a === void 0 ? void 0 : _a.effective_severity_level
                        });
                    });
                    links = response.data.links || {};
                    allIssues.push.apply(allIssues, issues);
                    if (!links.next) return [3 /*break*/, 4];
                    url = new URL(links.next, snykApiUrl);
                    nextCursor = url.searchParams.get("starting_after");
                    return [4 /*yield*/, getIssuesByOrg(org, nextCursor, allIssues)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [2 /*return*/, allIssues];
                case 5:
                    error_2 = _a.sent();
                    throw error_2;
                case 6: return [2 /*return*/];
            }
        });
    });
};
var getIssuesByOrgs = function (org) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getIssuesByOrg(org)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var processIssuesBySeverity = function (issues) {
    var orgsWithIssueCounts = issues.reduce(function (orgs, issue) {
        if (!orgs[issue.orgId]) {
            orgs[issue.orgId] = {
                orgName: issue.orgName,
                severity: { critical: 0, high: 0, medium: 0, low: 0 }
            };
        }
        orgs[issue.orgId].severity[issue.severity]++;
        return orgs;
    }, {});
    return orgsWithIssueCounts;
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var orgs, allIssues, flattened, orgCounts, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getOrgData(snykApiUrl)];
            case 1:
                orgs = _a.sent();
                return [4 /*yield*/, Promise.all(orgs.map(getIssuesByOrgs))];
            case 2:
                allIssues = (_a.sent());
                flattened = allIssues.flat();
                orgCounts = processIssuesBySeverity(flattened);
                console.log("here");
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error fetching data from Snyk API:', error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=index.js.map