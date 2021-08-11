import { Tab } from "@headlessui/react";
import React, { useState } from "react";

function App() {
  return (
    <div className="App">
      <h1 className="text-center">SC2-Malaysia</h1>
      <Tab.Group>
        <Tab.List className="interval-group">
          <Tab className="interval-item">Daily</Tab>
          <Tab className="interval-item">Weekly</Tab>
          <Tab className="interval-item">Monthly</Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default App;
