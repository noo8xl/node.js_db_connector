import { Database } from "../src/services/database.service.js";
import { User, UserDetails, TwoStepParams} from "../src/types/user.types.js";
import { userDto } from "./variables.js"


let user = new User()
let userDetails = new UserDetails()
let userTwoStep = new TwoStepParams()
let db = new Database()

beforeEach(async ()=>{
  await user.setUser(userDto)
  await userDetails.setUser(UserDetails)
  await userTwoStep.setUser(TwoStepParams)

})

describe('saveUser()', function () {
  it('getUser -> should get user obj without errors', async () => {
    await db.saveUser(userDto)
  });
});

describe('getUser()', function () {
  it('getUser -> should get user obj by _id without errors', async () => {
    let result = await db.getUser(user.userId)
    console.log("test result is -> \n", result);
    return result
  });
});


describe('getUser()', function () {
  it('getUser -> should get user obj by email without errors', async () => {
    let result = await db.getUser(user.userEmail)
    console.log("test result is -> \n", result);
    return result
  });
});

describe('updateUser()', function () {
  it('getUser -> should get user obj by email without errors', async () => {
    let result = await db.updateUser("UserBase", "userEmail", user.userEmail, {userName: "new_name"})
    console.log("test result is -> \n", result);
    return result
  });
});

// describe('deleteUser()', function () {
//   it('getUser -> should get user obj by email without errors', async () => {
//     let result = await db.deleteUser(user.userId)
//     console.log("test result is -> \n", result);
//     return result
//   });
// });