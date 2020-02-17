import React from 'react';
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { apiCall } from './utils'

const formMachine = Machine({
  initial: "editing",
  context: {
    name: "",
    email: "",
    password: "",
  },
  states: {
    editing: {
      on: {
        CHANGE: {
          actions: assign({
            name: (ctx, e) => e.name || ctx.name,
            email: (ctx, e) => e.email || ctx.email,
            password: (ctx, e) => e.password || ctx.password,
          })
        },
        SUBMIT: "loading"
      },
    },
    loading: {
      invoke: {
        id: "submitting",
        src: ctx => apiCall(ctx),
        onDone: "success",
        onError: "failure"
      }
    },
    failure: {
      on: {
        SUBMIT: "loading"
      },
    },
    success: {
      type: "final"
    },
  },
});


function App() {
  const [current, send] = useMachine(formMachine, {
    actions: {
      loading: ctx => apiCall(...ctx)
    }
  });

  const { name, email, password } = current.context;

  const invalid = false;
  const editing = current.matches("editing");
  const loading = current.matches("loading");
  const failure = current.matches("failure");
  const success = current.matches("success");

  const submit = e => {
    e.preventDefault();
    send("SUBMIT");
  }

  // apiCall('a')

  return (
    <div className="App">
      {editing && <form onSubmit={submit}>
        <h3>Sign Up</h3>
        {invalid ? <div className="error">Sorry, that's invalid.</div> : null}
        <div className="formblock">
          <label>Name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => send("CHANGE", { name: e.target.value })}
          />
        </div>
        <div className="formblock">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={e => send("CHANGE", { email: e.target.value })}
          />
        </div>
        <div className="formblock">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => send("CHANGE", { password: e.target.value })}
          />
        </div>
        <button data-testid="save-button">
          Save
        </button>
      </form>}
      {loading && <h1>LOADING</h1>}
      {failure && (
        <div>
          <h1>FAILURE TRY AGAIN</h1>
          <button onClick={submit}>
            Save
          </button>
        </div>
      )}
      {success && (
        <div>
          <h1>SUCCESS</h1>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Password: {password}</p>
        </div>
      )}
    </div>
  );
}

export default App;
