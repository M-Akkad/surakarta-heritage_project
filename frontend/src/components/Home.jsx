import React from 'react';
import './styling/Home.css';

const locations = [
    {
        name: "Kraton",
        image: "/images/kraton.jpg",
        description: "The royal palace of Surakarta, a symbol of Javanese culture and tradition."
    },
    {
        name: "Pura Mangkunegaran",
        image: "/images/pura.jpg",
        description: "A historical palace reflecting Javanese-European architectural fusion."
    },
    {
        name: "Pasar Triwindu",
        image: "/images/triwindu.jpg",
        description: "A unique market known for its antiques, heritage items, and local charm."
    }
];

export default function Home() {
    return (
        <div className="home-container container-fluid px-3">
            <div className="text-center mb-5">
                <h1 className="display-5">Welcome to Surakarta Heritage</h1>
                <p className="lead mt-3">
                    This platform allows visitors to issue digital tickets for historical locations across Surakarta.
                </p>
            </div>

            <h4 className="mb-4">Explore Locations</h4>
            <div className="row">
                {locations.map((loc, idx) => (
                    <div key={idx} className="col-sm-12 col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <img src={loc.image} className="card-img-top" alt={loc.name}/>
                            <div className="card-body">
                                <h5 className="card-title">{loc.name}</h5>
                                <p className="card-text">{loc.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
