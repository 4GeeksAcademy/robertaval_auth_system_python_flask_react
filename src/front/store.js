

export const initialStore = () => {
  return {
    message: null,
    token: sessionStorage.getItem("token") || null,
    user: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_message':
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'set_token':
      sessionStorage.setItem("token", action.payload);
      return {
        ...store,
        token: action.payload
      };

    case 'clear_token':
      sessionStorage.removeItem("token");
      return {
        ...store,
        token: null,
        user: null
      };

    case 'set_user':
      return {
        ...store,
        user: action.payload
      };

    case 'add_task_color':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map(todo =>
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

