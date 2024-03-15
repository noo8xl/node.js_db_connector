import { createClient } from 'redis'
import ApiError from '../exceptions/apiError.exption.js';

// the doc is -> 
// https://redis.io/docs/connect/clients/nodejs/
// <- 
export class Cache {

  constructor() {}

  // setUserCache -> is "getUser" response obj (the instance of User and UserDetails)
  async setUserCache(dto) {
    // dto is obj from prepared cache method <- 
    const cl = await this.#connect()
    let c = await this.#prepareUserCacheData(dto)

    try {
      console.log("c before writing dto -> ", c);      
      await cl.hSet(c.userId, c)
    } catch (e) {
      throw await ApiError.ServerError()
    } 
    
    await cl.disconnect();
    return c
  }

  async getUserCache(key){
    const cl = await this.#connect()
    let c = {};

    try {
      const temp = await cl.hGetAll(key);
      c = JSON.parse(JSON.stringify(temp, null, 2))
      console.log("user c is =>\n", c);
    } catch (e) {
      throw await ApiError.ServerError()
    } 
    
    await cl.disconnect();
    return c
  }

  // ============================================================================ //

  async #prepareUserCacheData(dto){

    let c = {
      userId: dto.userBase.userId,
      userEmail: dto.userBase.userEmail,
      userName: dto.userBase.userName,
      accessType: dto.userDetails.accessType,
      isBanned: dto.userDetails.isBanned,
      twoStepAuth: dto.userDetails.twoStepAuth,
      isActivated: dto.userDetails.isActivated,
    }

    return c
  }

  async #connect(){
    const client = await createClient().
      on('connect', () => { console.log("redis is connected!"); }).
      on('error', async() => { throw await ApiError.ServerError() }).
      connect();

    return client

    // const client = createClient({
    //   username: 'default', // use your Redis user. More info https://redis.io/docs/management/security/acl/
    //   password: 'secret', // use your password here
    //   socket: {
    //       host: 'my-redis.cloud.redislabs.com',
    //       port: 6379,
    //       tls: true,
    //       key: readFileSync('./redis_user_private.key'),
    //       cert: readFileSync('./redis_user.crt'),
    //       ca: [readFileSync('./redis_ca.pem')]
    //   }
    // });

    // const url = conf.redis.url
    // const client = createClient({
    //   url
    // });

  }

}