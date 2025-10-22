const MyVideo = (props: MyVideoProps) => {    
    return <iframe className="my-video" allow="document-domain;encrypted-media;sync-xhr;usb;web-share;cross-origin-isolated;midi *;geolocation;camera *;microphone *;fullscreen;picture-in-picture;display-capture;accelerometer;autoplay;gyroscope;screen-wake-lock;" src={props.url}></iframe>
}

interface MyVideoProps{
    url: string
}

export default MyVideo