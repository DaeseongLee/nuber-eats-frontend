import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { Link, useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
    subscription cookedOrders {
        cookedOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => {
    return (<div className="text-lg">🚖</div>)
}

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

    const makeRoute = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRender = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#000",
                    strokeOpacity: 1,
                    strokeWeight: 5,
                },
            });

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
    };
    const { data: cookedOrdersData } = useSubscription<cookedOrders>(
        COOKED_ORDERS_SUBSCRIPTION
    );
    useEffect(() => {
        if (cookedOrdersData?.cookedOrders.id) {
            console.log("cookedOrdersData", cookedOrdersData);
            makeRoute();
        }
    }, [cookedOrdersData]);

    const history = useHistory();
    const onCompleted = (data: takeOrder) => {
        if (data.takeOrder.ok) {
            history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
        }
    };
    const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
        TAKE_ORDER_MUTATION,
        {
            onCompleted,
        }
    );
    const triggerMutation = (orderId: number) => {
        takeOrderMutation({
            variables: {
                input: {
                    id: orderId,
                },
            },
        });
    };


    return (
        <div>
            <div className="overflow-hidden"
                style={{ width: window.innerWidth, height: "50vh" }}
            >
                <GoogleMapReact
                    defaultZoom={13}
                    draggable={true}
                    onGoogleApiLoaded={onApiLoaded}
                    defaultCenter={{
                        lat: 36.1488339,
                        lng: 129.2575831
                    }}
                    bootstrapURLKeys={{ key: "AIzaSyDkRvqqO0XomHAIZyeJcb5NX9W8sZWQ-KE" }}
                >
                    {/* <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
                    <Driver lat={driverCoords.lat + 0.01} lng={driverCoords.lng + 0.01} /> */}
                </GoogleMapReact>
            </div>
            <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
                {cookedOrdersData?.cookedOrders.restaurant ? (
                    <>
                        <h1 className="text-center  text-3xl font-medium">
                            New Coocked Order
                        </h1>
                        <h1 className="text-center my-3 text-2xl font-medium">
                            Pick it up soon @{" "}
                            {cookedOrdersData?.cookedOrders.restaurant?.name}
                        </h1>
                        <button
                            onClick={() =>
                                triggerMutation(cookedOrdersData?.cookedOrders.id)
                            }>
                            Accept Challenge &rarr;
                        </button>
                    </>
                ) : (
                    <h1 className="text-center  text-3xl font-medium">
                        No orders yet...
                    </h1>
                )}
            </div>
        </div>
    )
}