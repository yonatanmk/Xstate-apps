import React from 'react';
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

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
        SUBMIT: "submitted"
      },
    },
    submitted: {
      type: "final"
    },
  },
});


function App() {
  const [current, send] = useMachine(formMachine)
  const { name, email, password } = current.context;

  const invalid = false;
  const submitted = current.matches("submitted");

  return (
    <div className="App">
      <form
        onSubmit={e => {
          e.preventDefault();
          send("SUBMIT");
        }}
      >
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
        {!submitted && <button data-testid="save-button">
          Save
        </button>}
      </form>
      {submitted && (
        <div>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Password: {password}</p>
        </div>
      )}
    </div>
  );
}

export default App;
