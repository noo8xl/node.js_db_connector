import { Cache } from "../services/cache.service.js"

export class User {
  userId
  userEmail
  userName
  userPassword

  constructor() {}

  async setUser(dto) {
    this.userId = dto.userId
    this.userEmail = dto.userEmail
    this.userName = dto.userName
    this.userPassword = dto.userPassword
  }

  // async setCache(dto) {
  //   let cache = new Cache()
  //   return await cache.setUserCache(dto)
  // }

}


export class UserDetails {
  userId
  joinDate
  accessType // admin, staff, user
  isActivated
  twoStepAuth
  isBanned

  constructor() {}

  async setUser(dto) {
    this.userId = dto.userId
    this.joinDate = dto.joinDate
    this.accessType = dto.accessType
    this.isActivated = dto.isActivated
    this.twoStepAuth = dto.twoStepAuth
    this.isBanned = dto.isBanned
  }

  async setUserId(id) {
    this.userId = id
  }

  // __________________________

  #doSome() {}

}

export class TwoStepParams {
  userId
  type // email OR telegram 
  enableDate // update to cur date at Enable 2fa
  telegramId // int64 id here <-

  constructor() {}

  async setUser(dto) {
    this.userId = dto.userId
    this.type = dto.type
    this.enableDate = dto.enableDate
    this.telegramId = dto.telegramId
  }

  async setUserId(id) {
    this.userId = id
  }

  // __________________________

  #doSome() {}

}
