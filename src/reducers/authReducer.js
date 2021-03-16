export default function authReducer(state = [], action) {
  if (action.type === "USER_INFO") {
    return [{ id: action.id, role: action.role }];
  } else {
    return state;
  }
}
