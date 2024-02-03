
export const userDto = {
  userId: "65b8e03c438391a62c46ffe8",
  userEmail: "test@example.net",
  userName: "test user",
  userPassword: "123qweasdzxc"
}

export const userDetailsDto = {
  userId: "65b8e03c438391a62c46ffe8",
  joinDate: new Date().getTime(),
  accessType: "user",
  isActivated: true,
  twoStepAuth: false,
  isBanned: false,
  userPassword: "123qweasdzxc"
}

export const userTwoStepDto = {
  userId: "65b8e03c438391a62c46ffe8",
  enableDate: new Date().getTime(),
  type: "email",
  telegramId: 874126412883
}