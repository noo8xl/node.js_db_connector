import { MongoClient } from 'mongodb'
import { mongoDb } from "../config/config.js";
import ApiError from '../exceptions/apiError.exption.js';


export class UserDatabaseInteraction {
  #dbName = mongoDb.name
  #client

  constructor() {}

  async insertRequest(colName, dto) { // dto -> User is instance
    await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let insId = ""

    try {
      let result = await colection.insertOne(dto)
      insId = result.insertedId.toString()
    } catch (e) {
      throw await ApiError.ServerError()
    } finally {
      await cl.close()
      return insId
    }
  }

  // async insertMultiplyDataRequest(colName, dto) { // dto -> User is instance
  //   await this.#initConnection()
  //   const cl = this.#client 
  //   const database = cl.db(this.#dbName)
  //   const colection = database.collection(colName)
  //   let insId = ""

  //   try {
  //     let result = await colection.insertOne(dto)
  //     insId = result.insertedId.toString()
  //   } catch (e) {
  //     throw await ApiError.ServerError()
  //   } finally {
  //     await cl.close()
  //     return insId
  //   }
  // }


  async findRequest(colName, fName, fVal) {
    await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let filter = {}
    let result = {}
    filter[fName] = fVal
 
    console.log("filter is -> \n", filter);
    
    try {
      result = await colection.findOne(filter)
    } catch (e) {
      throw await ApiError.ServerError()
    } finally {
      await cl.close()
      return result
    }
  }

  async findMultFilterRequest(colName, filterData) {
    await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)

    let filter = {}
    let keyList = Object.keys(filterData)
    let valuetList = Object.values(filterData)
    
    for (let i = 0; i <= keyList.length -1; i++)
      filter[keyList[i]] = valuetList[i]
    
    let result = {}

    try {
      result = await colection.findOne(filter)
    } catch (e) {
      throw await ApiError.ServerError()
    } finally {
      await cl.close()
      return result
    }
  }


  // databaseUpdateRequest -> update document 
  async updateRequest(colName, fName, fVal, uDoc) {
    await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let filter = {}
    let result
    filter[fName] = fVal
    const updatedDoc = {$set: uDoc}

    try {
      result = await colection.updateOne(filter, updatedDoc)
      console.log("result.modifiedCount => ", result.modifiedCount);
    } catch (e) {
      throw await ApiError.ServerError()
    } finally {
      await cl.close()
    }
    if (result.modifiedCount < 1) throw await ApiError.ServerError()
    return true
  }
  
  async deleteRequest(colName, fName, fVal) {
    await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let filter = {}
    filter[fName] = fVal

    try {
      await colection.deleteOne(filter)
    } catch (e) {
      throw await ApiError.ServerError()
    } finally {
      await cl.close()
      return true
    }
  }



  // ============================================================================================ //
  

  async #getMongoUri(){
    let temp
    let uri
    let template = mongoDb.uri
  
    temp = template.replace("<userName>", mongoDb.user)
    uri = temp.replace("<userPassword>", mongoDb.password)

    // console.log("cur uri is -> \n", uri);
    return uri
  }

  async #initConnection() {
    const uri = await this.#getMongoUri()
    this.#client = new MongoClient(uri)
  }

}