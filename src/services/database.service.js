import { TwoStepParams, User, UserDetails } from '../types/user.types.js';
import { DatabaseInteraction } from './database.core.js';
import { Cache } from './cache.service.js';
import { ObjectId } from "mongodb"
import ApiError from '../exceptions/apiError.exption.js';

export class Database extends DatabaseInteraction {

  constructor () {
    super()
    super.initConnection()
  }

  // getUser => looking for user by email or id
  async getUser(str) { // returned response will => {user: {}, tokenPair: {}}
    const user = await this.#findUserRequest(str)
    await super.disconnectClient()
    return user
  }

  async saveUser(dto) { // return inserted userId 
    await this.#isUserExists(dto.userEmail)
    const userId = await this.#insertUserRequest(dto)
    await super.disconnectClient()
    return userId
}
  
  async updateUser(colName, f, v, dto){
    
    // colName -> db document name 
    // f -> filter key name (find by)
    // v -> filter value name (where val is)
    // dto -> obj with data for update

    const result = await this.#updateUserRequest(colName, f, v, dto) 
    await super.disconnectClient()
    return result
  }


  // ---> * available only for < admin > user * <---
  async deleteUser(userId, customerId){
    await this.#isAccess(userId) // chceck a permissoin
    const result = await this.#deleteUserRequest(customerId) // delete current user 
    await super.disconnectClient()
    return result
  }

  // =========================================================================================== //
  // ################################### private method area ################################### //
  // =========================================================================================== //

  async #isUserExists(email) {
    const candidate = await super.findRequest("UserBase", "userEmail", email)
    if (candidate) throw await ApiError.BadRequest()
    await super.disconnectClient()
  }
  
  async #isAccess(userId){
    const candidate = await super.findRequest("UserParams", "userId", userId)
    if(candidate.accessType === "user") throw await new ApiError.PermissionDenied()
    if(candidate.accessType === "staff") throw await new ApiError.PermissionDenied()
    await super.disconnectClient()
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
    await super.disconnectClient()
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
    await super.disconnectClient()
    return response
  }

  async #updateUserRequest(colName, fName, fVal, uDoc) {
    const result = super.updateRequest(colName, fName, fVal, uDoc)
    await super.disconnectClient()
    return result
  }

  async #deleteUserRequest(customerId) {

    // get all user data
    let result
    const userDocList = []

    for (let i = 0; i < userDocList.length -1 ; i++) 
      await super.deleteRequest(userDocList[i], "userId", customerId) 

    // in the end of -> delete base user document <-
    result = super.deleteRequest("UserBase", fName, fVal)
    await super.disconnectClient()
    return result
  }


}