import React, { useState, useEffect } from "react";
import api from "../../api";

export default function TestComponent() {
  const [state, setState] = useState({ secret: null, message: null });
  return (
    <div className="Secret">
      <h2>Secret</h2>

      <div className="result">{state.secret}</div>

      {state.message && <div className="info info-danger">{state.message}</div>}
    </div>
  );
}
