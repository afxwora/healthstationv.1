import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

const ChiangMuanMap: React.FC = () => {
    const [data, setData] = useState<{ normal: any[], disability: any[] } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9999/api/dashboard/dashboardMap',
                    {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                );
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const bounds: L.LatLngBoundsLiteral = [
        [18.80666454222581, 100.2739308230689],
        [18.945194060177045, 100.40447065616955], 
    ];

    const MapWithBounds = () => {
        const map = useMap();
        map.fitBounds(bounds);
        return null;
    };

    const renderCircles = (data: any[]) => {
        return data.map((point, index) => {
            const color = point.type === 'มีความพิการ' ? 'red' : 'green'
            return (
                <CircleMarker
                    key={`circle-${index}`}
                    center={[point.latitude, point.longitude]}
                    radius={3}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.1 }}
                >
                    <Popup>
                        <span>{point.type}</span>
                    </Popup>
                </CircleMarker>
            );
        });
    };

    return (
        <MapContainer
            style={{ height: '500px', width: '100%' }}
            center={[18.883917474563553, 100.33176492634134]} 
            zoom={13}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapWithBounds />
            {data && (
                <>
                    {renderCircles(data.normal)}
                    {renderCircles(data.disability)}
                </>
            )}
        </MapContainer>
    );
};

export default ChiangMuanMap;
