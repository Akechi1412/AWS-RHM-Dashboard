import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from 'react';

const Dropdown = ({ children, title }) => {
  const dropdown = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdown.current && !dropdown.current.contains(event.target)) {
        setShow(false);
      }
    }

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdown} className="dropdown">
      <div onClick={() => setShow((show) => !show)} className="dropdown-toggle">
        <span className="dropdown-title">{title}</span>
        <FontAwesomeIcon className="dropdown-icon" icon={faCaretDown} />
      </div>
      {show && (
        <div onClick={() => setShow((show) => !show)} className="dropdown-menu">
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dropdown;
