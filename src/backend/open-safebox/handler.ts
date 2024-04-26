
type Dependencies = {};

export const handler = ({

}: Dependencies) => () => {
  // 1 - fetch safebox
  // 1.5 - check if its is blocked
  // 2 - validate credentials, if failes add attempt count, if 3 it will be blocked
  // 3 - generate token, with 3 minutes life span
}