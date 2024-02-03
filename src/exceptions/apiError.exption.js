
export default class ApiError extends Error {
  message
  status
  errors

  constructor(status, message, errors= []) {
    super(message)
    this.message = message
    this.status = status
    this.errors = errors
  }

  // static async UnauthorizedError(){
  //   return new ApiError(401, 'unauthorized user')
  // }

  static async PermissionDenied() {
    return new ApiError(403, "Permission denied!")
  }

  static async BadRequest() {
    return new ApiError(400, "Bad request")
  }

  static async ServerError() {
    return new ApiError(500, "Internal server error.")
  }
}

