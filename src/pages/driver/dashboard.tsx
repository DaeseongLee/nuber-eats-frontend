import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

interface ICoords {
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
    const [map, setMap] = useState<any>();
    const [maps, setMaps] = useState<google.maps.Map>(); //google은 window안에 있는 내장객체이다

    //@ts-ignore
    const onSuccess = ({ coords: { latitude, longitude } }: Position) => {
        setDriverCoords({ lat: latitude, lng: longitude });
    };
    //@ts-ignore
    const onError = (error: PositionError) => {
        console.log(error);
    }
    useEffect(() => {
        // if (map && maps) {
        //     map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        //     const geocoder = new google.maps.Geocoder();
        //     geocoder.geocode(
        //         {
        //             location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        //         },
        //         (results, status) => {
        //             console.log(status, results);
        //         }
        //     )
        // }
    }, [driverCoords.lat, driverCoords.lng]);

    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        });
    }, []);

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        setMap(map);
        setMaps(maps);
    };

    const onGetRouteClick = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRender = new google.maps.DirectionsRenderer();
            console.log('directionsService', directionsService);
            console.log('directionsRender', directionsRender);

            directionsRender.setMap(map);
            directionsService.route(
                {
                    origin: {
                        location: new google.maps.LatLng(
                            driverCoords.lat,
                            driverCoords.lng
                        )
                    },
                    destination: {
                        location: new google.maps.LatLng(
                            driverCoords.lat + 0.05,
                            driverCoords.lng + 0.05
                        ),
                    },
                    travelMode: google.maps.TravelMode.DRIVING,

                }, (result) => {
                    directionsRender.setDirections(result);
                })

        }
    }
    return (
        <div>
            <div className="overflow-hidden"
                style={{ width: window.innerWidth, height: "50vh" }}
            >
                <GoogleMapReact
                    defaultZoom={16}
                    draggable={true}
                    onGoogleApiLoaded={onApiLoaded}
                    defaultCenter={{
                        lat: 36.1488339,
                        lng: 129.2575831
                    }}
                    bootstrapURLKeys={{ key: "AIzaSyDkRvqqO0XomHAIZyeJcb5NX9W8sZWQ-KE" }}
                >
                    <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
                </GoogleMapReact>
            </div>
            <button onClick={onGetRouteClick}>Get route</button>
        </div>
    )
}