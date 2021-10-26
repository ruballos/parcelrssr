//import 'regenerator-runtime/runtime'

import React, { Component } from "react";
import "./App.css";

import packageJson from '../package.json';
global.appVersion = packageJson.version;

class App extends Component {
  constructor() {
    super();
    this.state = {
      visible_modal: false,

      screen_mode: "normal",

      autenticado: true,
      modal_catalogo: false,
      catalogo_24_72: 24
    };

    this.searchInput = React.createRef();

  }

  componentDidMount() {

    //cambio de tamaño de ventana
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.resize.bind(this));
      this.resize();
    }



  }

  resize() {
    if (window.innerWidth >= 320 && window.innerWidth <= 768) {
      this.setState({ screen_mode: "mobile" });
    } else {
      this.setState({ screen_mode: "normal" });
    }
  }


  render() {
    return (
      <div>Hello world</div>
    );
  }


}



export default App;
