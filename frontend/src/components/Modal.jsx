import React from 'react';
import PropTypes from 'prop-types';

import 'src/components/style/admin.css';

const Modal = ({ show, handleClose, children }) => {
  console.log("Modal show prop:", show);
  if (!show) return null; // Render only if `show` is true

  return (
    <div className="modal display-block">
      <div
        className="modal-main-wrapper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <section className="modal-main">
          
          {children}
          <button type="button" className="modal-close" onClick={handleClose}>
            Close
          </button>
        </section>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
