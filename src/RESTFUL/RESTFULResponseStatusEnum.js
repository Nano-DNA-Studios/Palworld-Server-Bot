"use strict";
var RESTFULResponseStatusEnum;
(function (RESTFULResponseStatusEnum) {
    RESTFULResponseStatusEnum[RESTFULResponseStatusEnum["SUCCESS"] = 200] = "SUCCESS";
    RESTFULResponseStatusEnum[RESTFULResponseStatusEnum["ERROR"] = 400] = "ERROR";
    RESTFULResponseStatusEnum[RESTFULResponseStatusEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
})(RESTFULResponseStatusEnum || (RESTFULResponseStatusEnum = {}));
module.exports = RESTFULResponseStatusEnum;
