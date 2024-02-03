import { User, UserDetails, TwoStepParams } from "../src/types/user.types.js";
import { userDto, userDetailsDto, userTwoStepDto } from "./variables.js";

describe('setUser()', function () {
  it(' User setUser -> should set user without errors', async () => {
    let user = new User()
    await user.setUser(userDto)
  });
});

describe('setUser()', function () {
  it('UserDetails setUser -> should set user without errors', async () => {
    let details = new UserDetails()
    await details.setUser(userDetailsDto)
  });
});

describe('setUser()', function () {
  it('TwoStepParams setUser -> should set user without errors', async () => {
    let twoFA = new TwoStepParams()
    await twoFA.setUser(userTwoStepDto)
  });
});