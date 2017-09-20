function createThunkMiddleware(errorHandler, extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      try {
        return action(dispatch, getState, extraArgument);
      } catch (err) {
        errorHandler(err, getState(), action, dispatch);
        return err;
      }
    }

    try {
      return next(action);
    } catch (err) {
      errorHandler(err, getState(), action, dispatch);
      return err;
    }
  };
}

export default createThunkMiddleware;
