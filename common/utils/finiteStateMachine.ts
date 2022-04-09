const finiteStateMachine = <State, Token>(initialState: State, rules: [state: State, token: Token, nextState: State][]) => {
  const state = { state: initialState };
  const dispatch = (token: Token) => {
    state.state = rules.find(rule => rule[0] == state.state && rule[1] == token)?.[2];
    return state.state;
  };
  const getState = () => state.state;
  return {getState, dispatch};
}

export default finiteStateMachine;
