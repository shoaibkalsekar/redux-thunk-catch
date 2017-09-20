# Redux Thunk with catch support
A redux thunk alternative with error handling support.

### Install:
```
npm i --save redux-thunk-catch
```

### Usage

**Import**
_Note: You are importing a function, that creates thunk middleware, not the thunk middleware itself._
```
import createThunk from 'redux-thunk-catch';
```

**Create a error reporting function**
```
const reportError = (err, state, action, dispatch) => {
  crashReporter.capture(err, {
    state,
    action
  });
}
```

**Pass error reporting function to createThunk**
```
const thunk = createThunk(reportError)
```

Now thunk can be used as any other middleware, using applyMiddleware(). You can read the [documentation](https://github.com/gaearon/redux-thunk) for thunk for its detailed usage.
