import chai from 'chai';
import createThunkMiddleware from '../src/index';
import * as tt from 'typescript-definition-tester';

const noop = () => {};
const thunkMiddleware = createThunkMiddleware(noop);

describe('thunk middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const nextHandler = thunkMiddleware({dispatch: doDispatch, getState: doGetState});

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler();

      chai.assert.isFunction(actionHandler);
      chai.assert.strictEqual(actionHandler.length, 1);
    });

    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', done => {
        const actionHandler = nextHandler();

        actionHandler((dispatch, getState) => {
          chai.assert.strictEqual(dispatch, doDispatch);
          chai.assert.strictEqual(getState, doGetState);
          done();
        });
      });

      it('must pass action to next if not a function', done => {
        const actionObj = {};

        const actionHandler = nextHandler(action => {
          chai.assert.strictEqual(action, actionObj);
          done();
        });

        actionHandler(actionObj);
      });

      it('must return the return value of next if not a function', () => {
        const expected = 'redux';
        const actionHandler = nextHandler(() => expected);

        const outcome = actionHandler();
        chai.assert.strictEqual(outcome, expected);
      });

      it('must return value as expected if a function', () => {
        const expected = 'rocks';
        const actionHandler = nextHandler();

        const outcome = actionHandler(() => expected);
        chai.assert.strictEqual(outcome, expected);
      });

      it('must be invoked synchronously if a function', () => {
        const actionHandler = nextHandler();
        let mutated = 0;

        actionHandler(() => mutated++);
        chai.assert.strictEqual(mutated, 1);
      });
    });
  });

  describe('handle errors', () => {
    it('must throw if argument is non-object', done => {
      try {
        thunkMiddleware();
      } catch (err) {
        done();
      }
    });
  });

  describe('with error handler', () => {
    it('must throw error if action is a functiona and throws error', done => {
      const err = new Error('Testing error');
      const errFunc = () => {throw err;};
      const errThrown = thunkMiddleware({
        dispatch: doDispatch,
        getState: doGetState,
      })(noop)(errFunc);
      chai.assert.strictEqual(errThrown, err);
      done();
    });

    it('must throw error if next throws error', done => {
      const err = new Error('Testing error');
      const errFunc = () => {throw err;};
      const errThrown = thunkMiddleware({
        dispatch: doDispatch,
        getState: doGetState,
      })(errFunc)({});
      chai.assert.strictEqual(errThrown, err);
      done();
    });
  });

  describe('TypeScript definitions', function test() {
    this.timeout(0);

    it('should compile against index.d.ts', (done) => {
      tt.compileDirectory(
        __dirname,
        fileName => fileName.match(/\.ts$/),
        () => done()
      );
    });
  });
});
