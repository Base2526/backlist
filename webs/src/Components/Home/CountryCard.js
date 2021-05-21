import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Buttonx from "./Button";

const options = {
  // settings: {
  //   overlayColor: "rgb(25, 136, 124)",
  //   autoplaySpeed: 1500,
  //   transitionSpeed: 900,
  // },
  buttons: {
    // backgroundColor: "#1b5245",
    // iconColor: "rgba(126, 172, 139, 0.8)",
    showAutoplayButton: false,
    showFullscreenButton: false
  },
  // caption: {
  //   captionColor: "#a6cfa5",
  //   captionFontFamily: "Raleway, sans-serif",
  //   captionFontWeight: "300",
  //   captionTextTransform: "uppercase",
  // }
};

const elements = [
  {
    src: 'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash05.jpg',
    caption: 'Lorem ipsum dolor sit amet',
    width: 1920,
    height: 'auto'
  },
  {
    src: 'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash05.jpg',
    thumbnail: 'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash05.jpg',
    caption: 'Commodo commodo dolore',
    width: 1024,
    height: 'auto'
  },
  {
    src: 'https://vimeo.com/458698330',
    thumbnail:
      'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash05.jpg',
    caption: 'Vimeo video',
    autoplay: false,
    showControls: true
  }
]

// const { openLightbox } = useLightbox();

class CountryCard extends Component {

  componentDidMount(){
    
  }
  
  render() {
    const { cca2: code2 = "", region = null, name = {} } =this.props.country || {};

    return (
      <Fragment>
        <div className="col-sm-6 col-md-4 country-card">
          <button style={{outline: 'none !important'}}  onClick={()=>{
            console.log(this.props)

            // this.nextPath('/help')
            // this.props.history.push('/help');
            // openLightbox()
          }}>
            <div className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">
            <Buttonx />
            
              <div className="px-3">
                <span className="country-name text-dark d-block font-weight-bold">
                  {name.common}
                </span>
                <span className="country-region text-secondary text-uppercase">
                  {region}
                </span>
              </div>
            </div>
          </button>
        </div>

    
      </Fragment>
    );
  }
}

CountryCard.propTypes = {
  country: PropTypes.shape({
    cca2: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    name: PropTypes.shape({
      common: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default CountryCard;
