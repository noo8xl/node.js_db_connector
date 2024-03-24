import { MongoClient } from 'mongodb'
import { mongoDb } from "../config/config.js";
import ApiError from '../exceptions/apiError.exption.js';


// DatabaseInteraction -> is database interaction class, 
// which provides connection, disconnection and queries 
export class DatabaseInteraction {
  #dbName = mongoDb.name
  #client


  // #####################################################################################

  // #dbName -> is database name 
  // #client -> is instance of connection 
  // colName -> database collection name
  // dto -> data transfer object (your data)
  // fName -> filter object name (ex: {fName: "some value"})
  // fVal -> filter object data  (ex: {someKey: fVal})
  // uDoc -> object (document) with data which should be updated (ex: {userName: "some value"})
  // filterData -> is object with some data (ex: {user: "test1", password: "pwd1", etc.})

  // #####################################################################################


  constructor() {}

  async initConnection() {
    const uri = await this.#getMongoUri()
    console.log("uri -> ", uri);
    this.#client = new MongoClient(uri)
  }


  async disconnectClient(){
    await this.#client.close()
  }

  async insertRequest(colName, dto) { // dto -> is instance of User 
    // await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let insId = ""

    try {
      let result = await colection.insertOne(dto)
      insId = result.insertedId.toString()
    } catch (e) {
      throw await ApiError.ServerError()
    } 
    
    // await cl.close()
    return insId
  }

  // async insertMultiplyDataRequest(colName, dto) {
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
    // await this.#initConnection()
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
    }

    // await cl.close()
    return result
  }

  async findMultFilterRequest(colName, filterData) {
    // await this.#initConnection()
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
    } 

    // await cl.close()
    return result
  }


  // databaseUpdateRequest -> update document 
  async updateRequest(colName, fName, fVal, uDoc) {
    // await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let filter = {}
    let result
    // build a filter object from received key and value (ex: filter = {fName: fVal})
    filter[fName] = fVal
    const updatedDoc = {$set: uDoc}

    try {
      result = await colection.updateOne(filter, updatedDoc)
      console.log("result.modifiedCount => ", result.modifiedCount);
    } catch (e) {
      throw await ApiError.ServerError()
    }

    // await cl.close()
    if (result.modifiedCount < 1) throw await ApiError.ServerError()
    return true
  }
  
  async deleteRequest(colName, fName, fVal) {
    // await this.#initConnection()
    const cl = this.#client 
    const database = cl.db(this.#dbName)
    const colection = database.collection(colName)
    let filter = {}
    filter[fName] = fVal

    try {
      await colection.deleteOne(filter)
    } catch (e) {
      throw await ApiError.ServerError()
    } 
    // await cl.close()
    return true
  }



  // ============================================================================================ //
  

  async #getMongoUri(){
    let template = mongoDb.uri
  
    let temp = template.replace("<userName>", mongoDb.user)
    let uri = temp.replace("<userPassword>", mongoDb.password)
    return uri
  }

}