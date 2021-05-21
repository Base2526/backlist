import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const NotificationsPage = (props) => {
    const history = useHistory();

    useEffect(() => {
        let {item} = props.location.state
        let {id} = props.match.params
        console.log('DetailPage useEffect : props > ', props, item)
    });

    const handleClick = () => {
        history.push("/");
    }
  
    return (
        <div>
            {
            ['1', '2', '3', '4', '5'].map(item => (
                <div key={item} className="notifications-item">
                    <LazyLoadImage
                      className="lazy-load-image-border-radius"
                      alt={'image.alt'}
                      width="40px"
                      height="40px"
                      effect="blur"
                    //   onClick={handleClick}
                      src={'https://avatars.githubusercontent.com/u/900211?s=60&v=4'} />
                    <div>40+ items were just added to your buy and sell groups.</div>
                    <div> 11 hours ago </div>
                </div>
            ))
            }
        </div>
    );
};
  
export default NotificationsPage;