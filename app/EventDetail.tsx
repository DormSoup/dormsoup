"use client"

// TODO: Expose some api to get the body of the email
import React from "react";
import ReactDOM from "react-dom";

const EventDetail = ({ onClose, children, title }: { onClose: () => void, children: React.ReactNode, title: string }) => {
    const handleCloseClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal">
                    <div className="modal-header">
                        <a href="#" onClick={handleCloseClick}>
                            x
                        </a>
                    </div>
                    {title && <h1>{title}</h1>}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root")!!
    );
};

export default EventDetail;