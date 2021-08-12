import { Tab } from "@headlessui/react";
import React, { useState } from "react";
import Card from "./Components/Card";
import HeaderBar from "./Components/HeaderBar";

function App() {
  return (
    <div className="App">
      <HeaderBar />
      <Tab.Group>
        <Tab.List className="interval-group">
          <Tab className="interval-item">Daily</Tab>
          <Tab className="interval-item">Weekly</Tab>
          <Tab className="interval-item">Monthly</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel key="1">
            <Card data={20700} title={"Total Cases"} />
            <Card data={201} title={"Total Death"} />
            <Card data={357981} title={"Total Vaccinated"} />
            <Card data={160320} title={"1st Dose Vaccinated"} />
            <Card data={197661} title={"2st Dose Vaccinated"} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default App;
