import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Proyek Membangun CI/CD Pipeline dengan Jenkins</h1>
        </header>
        <p className="App-intro">
          Hello, saya eka prasetya ramadhan saat ini sedang belajar implementasi CI CD
          <br />
          Applikasi React APP & Simple Python Pyinstaller App
          <br />
          CI CD Pipeline menggunakan Jenkins
          <br />
          Operation dan Monitoring menggunakan Prometheus dan Grafana
          <br />
          <br />
          <br />
          <br />
          Semoga mendapatkan kesempatkan dikelas expert!!!!!!!!!!!!!!!!!!!!!! 🚀
        </p>
      </div>
    );
  }
}

export default App;
