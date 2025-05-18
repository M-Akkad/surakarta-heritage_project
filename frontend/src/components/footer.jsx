import React from "react";

export default function Footer() {
    return (
        <footer className="bg-light text-center py-4 mt-5 border-top">
            <div className="container">
                <p className="mb-0 text-muted small">
                    © {new Date().getFullYear()} Surakarta Heritage · All rights reserved.
                </p>
            </div>
        </footer>
    );
}
