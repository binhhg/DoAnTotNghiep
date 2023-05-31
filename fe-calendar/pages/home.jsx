import React, {useEffect,useRef} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, Button } from 'react-bootstrap';
export default function Home(){
    const modalRef = useRef(null);

    const closeModal = () => {
        const modal = modalRef.current;
        if (modal) {
            modal.classList.remove('exampleModal');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    function handelModal(){
        const modal = document.getElementById('exampleModal')
        modal.classList.add('show')
        modal.style.display = 'block'
        document.body.classList.add('modal-open')
    }
    return (
        <>
            <button type="button" className="btn btn-primary" onClick={() =>handelModal()}>
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
