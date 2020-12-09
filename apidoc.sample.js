/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 * @apiSampleRequest http://api.github.com/some_path/
 * @apiParamExample {json} Request-Example:
 *    {
 *       "id": 4711
 *    }
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */




"openapi": "3.0.0",
"info": {
    "title": "Wissenspos Restaurant Management Api",
    "description": "APi for the wissenspos restaurant management system"
},
"servers": [
    {
        "url": "http://localhost:5000/api/v1",
        "description": "Local developent server"
    },
    {
        "url": "https://wissenspos.herokuapp.com/api/v1",
        "description": "development server"
    }
],