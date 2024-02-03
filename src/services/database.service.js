import { TwoStepParams, User, UserDetails } from '../types/user.types.js';
import { UserDatabaseInteraction } from './database.core.js';
import { Cache } from './cache.service.js';
import { ObjectId } from "mongodb"
import ApiError from '../exceptions/apiError.exption.js';

export class Database extends UserDatabaseInteraction {

  constructor () {
    super()
  }

  // getUser => looking for user by email or id
  async getUser(str) { // returned response will => {user: {}, tokenPair: {}}
    return await this.#findUserRequest(str)
  }

  async saveUser(dto) { // return inserted userId 
    await this.#isUserExists(dto.userEmail)
    return await this.#insertUserRequest(dto)
}

  async updateUser(colName, f, v, dto){
    
    // colName -> db document name 
    // f -> filter key name (find by)
    // v -> filter value name (where val is)
    // dto -> obj with data for update

    return await this.#updateUserRequest(colName, f, v, dto) 
  }


  // ---> * available only for < admin > user * <---
  async deleteUser(userId, customerId){
    await this.#isAccess(userId) // chceck a permissoin
    return await this.#deleteUserRequest(customerId) // delete current user 
  }

  // =========================================================================================== //
  // ################################### private method area ################################### //
  // =========================================================================================== //

  async #isUserExists(email) {
    const candidate = await super.findRequest("UserBase", "userEmail", email)
    if (candidate) throw await ApiError.BadRequest()
  }
  
  async #isAccess(userId){
    const candidate = await super.findRequest("UserParams", "userId", userId)
    if(candidate.accessType === "user") throw await new ApiError.PermissionDenied()
    if(candidate.accessType === "staff") throw await new ApiError.PermissionDenied()
  }
  
  async #insertUserRequest(dto) {
    let joinStamp = new Date().getTime()
    let resultId
        
    const user = new User()
    const params = new UserDetails()
    const twoStepParams = new TwoStepParams()

    user.setUser(dto)
    delete user.userId

    let paramsDto = {
      userId: "",
      joinDate: joinStamp,
      isActivated: false,
      twoStepAuth: false,
      accessType: "user",
      isBanned: false,
    }

    let twoStepDto = {
      userId: "",
      type: "empty",
      enableDate: 0,
      telegramId: 0,
    }

    resultId = await super.insertRequest("UserBase", dto)

    await params.setUser(paramsDto)
    await twoStepParams.setUser(twoStepDto)
    
    await params.setUserId(resultId.toString())
    await twoStepParams.setUserId(resultId.toString())

    await super.insertRequest("UserBase", paramsDto)
    await super.insertRequest("TwoStepParams", twoStepDto)

    return resultId
  }

  // async #findMultFilterRequest(colName, filterData) {
  //   return super.findMultFilterRequest(colName, filterData)
  // }


  async #findUserRequest(value) {

    let userBase = new User()
    let userDetails = new UserDetails()
    let cache = new Cache()
    let c // cached data 
    let curId // formatted id for db search
    let user // user from db
    let details // user details from db
    let tokenPair = {} // auth token pair
    let response = {user: {}, tokenPair: {}} // returnd data 


    if(!value.includes("@")) {
      curId = new ObjectId(value)
      c = await cache.getUserCache(value)
      if(Object.keys(c) < 1) {
        user = await super.findRequest("UserBase", "_id", curId)
      } else {
        // tokenPair = await tokenService.GetTokenPair(user)
        console.log("cached return");
        response = {user: c, tokenPair}
        return response
      }
    } else {
      user = await super.findRequest("UserBase", "userEmail", value)
    }

    details = await super.findRequest("UserParams", "userId", user._id.toString())
    
    // tokenPair = await tokenService.GetTokenPair(user)
    // if userDetails f2fa enabled -> send 2fa code 

    user.userId = user._id.toString()
    userBase.setUser(user)
    userDetails.setUser(details)
    
    c = await cache.setUserCache({ userBase, userDetails})

    response.user = c
    return response
  }

  async #updateUserRequest(colName, fName, fVal, uDoc) {
    return super.updateRequest(colName, fName, fVal, uDoc)
  }

  async #deleteUserRequest(customerId) {

    // get all user data
    const userDocList = []

    for (let i = 0; i < userDocList.length -1 ; i++) 
      await super.deleteRequest(userDocList[i], "userId", customerId) 

    // in the end of -> delete base user document <-
    return super.deleteRequest("UserBase", fName, fVal)
  }


}