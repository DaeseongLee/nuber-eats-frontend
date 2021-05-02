import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

interface ICoords {
    lat: number;
    lng: number;
}

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
    const [map, setMap] = useState<any>();
    const [maps, setMaps] = useState<any>();

    //@ts-ignore
    const onSuccess = ({ coords: { latitude, longitude } }: Position) => {
        setDriverCoords({ lat: latitude, lng: longitude });
    };
    //@ts-ignore
    const onError = (error: PositionError) => {
        console.log(error);
    }
    useEffect(() => {
        if (map && maps) {
            map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
        }
    }, [driverCoords.lat, driverCoords.lng]);

    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        });
    }, []);

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
        setMap(map);
        setMaps(maps);
    };

    return (
        <div>
            <div className="overflow-hidden"
                style={{ width: window.innerWidth, height: "50vh" }}
            >
                <GoogleMapReact
                    defaultZoom={16}
                    draggable={false}
                    onGoogleApiLoaded={onApiLoaded}
                    defaultCenter={{
                        lat: 36.1488339,
                        lng: 129.2575831
                    }}
                    bootstrapURLKeys={{ key: "AIzaSyDkRvqqO0XomHAIZyeJcb5NX9W8sZWQ-KE" }}
                >
                    <div
                        //@ts-ignore
                        lat={driverCoords.lat}
                        lng={driverCoords.lng}
                        className="text-lg">
                        🚴‍♂️
                        </div>


                </GoogleMapReact>
            </div>
        </div>
    )
}