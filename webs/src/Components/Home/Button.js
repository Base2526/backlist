import React, { useState, useEffect } from 'react';

/*
We can use the provided hook in case you want
to open the lightbox from a button or anything :)
*/
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

const elem = [
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

const ItemView =(country, elements)=>{

    console.log('ItemView country : ', country, elements)
    return <div key={country.id}>{country.capital}</div>
}

const Button = (props) => {

  const [elements, setElements] = useState(elem);

//   let _historys = [...historys].slice(0, 5); 

//   let _historys = [...historys].slice(0, 5); 

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;

    console.log('props.country : ', props.country)

    // let _elements = [...elements].slice(0, 10); 
    // console.log('_elements : ', _elements)
  });

  return (
    <div style={{margin:10}}>
      
    <button
        className="SRL_CTA-OpenLightbox"
        onClick={() => {
            console.log("props : ", props);
            // openLightbox(props.imageToOpen);
        }}
        >
        <div className="h-100 position-relative border-gray border-right px-2 bg-white rounded-left">
            {/* <img
            src={`https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash05.jpg`}
            className="d-block h-100"
            alt={`Flag`}
            /> */}

            {
                ItemView(props.country, elements)
            }
            <div >
                <div class="images">
                {
                    // switch(elements.length){
                    //     case 0: {
                    //         return <div />
                    //         break
                    //     }
                    // }

                    elements.slice(0, 2).map((itm, i)=>{
                        // console.log(i);
                        return  <button
                                    key={i}
                                    className="SRL_CTA-OpenLightbox"
                                    onClick={() => {
                                        // console.log("props : ", props, openLightbox());
                                        // openLightbox(props.imageToOpen);
                                    }}
                                    >
                                    <img style={{margin: 2}} src="http://dummyimage.com/200x50/000/fff.png" />
                                </button>
                    })

                }
                </div>
            </div>
            {/* <div >
                <div class="images">
                    <button
                        className="SRL_CTA-OpenLightbox"
                        onClick={() => {
                            console.log("props : ", props);
                            openLightbox(props.imageToOpen);
                        }}
                        >
                        <img style={{margin: 2}} src="http://dummyimage.com/200x50/000/fff.png" />
                    </button>
                    <button
                        className="SRL_CTA-OpenLightbox"
                        onClick={() => {
                            console.log("props : ", props);
                            openLightbox(props.imageToOpen);
                        }}
                        >
                        <img style={{margin: 2}} src="http://dummyimage.com/200x50/000/fff.png" />
                    </button>
                    <button
                        className="SRL_CTA-OpenLightbox"
                        onClick={() => {
                            console.log("props : ", props);
                            openLightbox(props.imageToOpen);
                        }}
                        >
                        <img style={{margin: 2}} src="http://dummyimage.com/200x50/000/fff.png" />
                    </button>
                </div>
                <div>
                    TEXT MESSAGE    
                </div>
            </div> */}
        </div> 
        </button>

    </div>
  );
};

export default Button;