import PropTypes from 'prop-types';

const Form = ({ heading, subheading, children }) => {
  return (
    <form action="" className="form" id="registerForm">
      <h3 className="form-heading">{heading}</h3>
      {subheading && <h4 className="form-subheading">{subheading}</h4>}
      <div className="form-inner">{children}</div>
    </form>
  );
};

Form.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  children: PropTypes.node,
};

export default Form;
