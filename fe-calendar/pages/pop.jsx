import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

import 'bootstrap/dist/css/bootstrap.min.css';
function Example() {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    return (
        <>
            <Button variant="danger" ref={target} onClick={() => setShow(!show)}>
                Click me to see
            </Button>
            <Overlay target={target.current} show={show} placement="right" rootClose onHide={()=> setShow(false)}>
                <Popover id="popover-basic">
                    <Popover.Header as="h3">Popover right</Popover.Header>
                    <Popover.Body>
                        And here's some <strong>amazing</strong> content. It's very engaging.
                        right?
                        <button>hehe</button>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </>
    );
}

export default Example;
