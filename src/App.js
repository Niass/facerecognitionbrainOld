import React from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import './App.css';


// const Clarifai = require('clarifai');
      
// Instantiate a new Clarifai app by passing in your API key.
const app = new Clarifai.App({apiKey: '62f75d793f0a491b94fa7c0917b9bb7a'});

const particlesOptions = {
  particles: {
    line_linked: {
      number: {
        value:80,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignIn:false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftcol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input}); 
    
    // Predict the contents of an image by passing in a URL.
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response));
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      })
      .catch(err => {
        console.log(err);
      });
    
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(({isSignIn:false}))
    } else if(route === 'home') {
      this.setState({isSignIn:true})
    }
    this.setState({route});
  }
  render() {
    const {isSignIn, route, box, imageUrl} = this.state
    return (
      <div className="App">
          <Particles className='particles'
              params= {particlesOptions}
           
            />
      <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />

      {
      route === 'home'
      ?<div> <Logo/>
      <Rank/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit} 
      /> 
      
      <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>
      
      : (
        route === 'signin'
        ?<SignIn onRouteChange={this.onRouteChange}/>
        :<Register onRouteChange={this.onRouteChange}/>
      )
      }
    </div>
    );
  }
}

export default App;
