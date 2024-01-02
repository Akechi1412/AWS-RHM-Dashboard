import Form from './form';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateForm = ({ serialNumber, userInfo, heading, subheading, hasTerms, onBack }) => {
  const genderList = [
    {
      name: 'male',
      label: 'Nam',
    },
    {
      name: 'female',
      label: 'Nữ',
    },
  ];
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [genderChecked, setGenderChecked] = useState('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  function handleBlurFullname(event) {
    if (event.target.value.trim() === '') {
      event.target.classList.add('empty');
    } else {
      event.target.classList.remove('empty');
    }
  }

  function handleBlurDateOfBirth(event) {
    if (event.target.value.trim() === '') {
      event.target.classList.add('empty');
    } else {
      event.target.classList.remove('empty');
    }
  }

  function handleBlurHeight(event) {
    if (event.target.value.trim() === '') {
      event.target.classList.add('empty');
    } else {
      event.target.classList.remove('empty');
    }
  }

  function handleBlurWeight(event) {
    if (event.target.value.trim() === '') {
      event.target.classList.add('empty');
    } else {
      event.target.classList.remove('empty');
    }
  }

  function handleBlurEmail(event) {
    if (event.target.value.trim() === '') {
      event.target.classList.add('empty');
    } else {
      event.target.classList.remove('empty');
    }
  }

  function handleSubmitForm(event) {
    event.preventDefault();
    setLoading(true);

    if (fullname.trim() === '') {
      setErrorText('Có trường bắt buộc bị bỏ trống.');
      return;
    }
    if (dateOfBirth.trim() === '') {
      setErrorText('Có trường bắt buộc bị bỏ trống.');
      return;
    }
    if (height.trim() === '') {
      setErrorText('Có trường bắt buộc bị bỏ trống.');
      return;
    }
    if (weight.trim() === '') {
      setErrorText('Có trường bắt buộc bị bỏ trống.');
      return;
    }
    if (email.trim() === '') {
      setErrorText('Có trường bắt buộc bị bỏ trống.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorText('Email không hợp lệ.');
      return;
    }
    if (hasTerms && !terms) {
      setErrorText('Bạn phải đồng ý với điều khoản và chính sách của chúng tôi.');
      return;
    }

    const data = {
      serialNumber,
      isActivated: true,
      userInfo: {
        fullname,
        gender: genderChecked,
        dateOfBirth,
        height,
        weight,
        email,
      },
    };

    axios
      .put('https://lu6zgo0804.execute-api.ap-southeast-1.amazonaws.com/production/device', data)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        setErrorText('');
        return Swal.fire({
          title: 'Cập nhập thành công',
          text: 'Thông tin của bạn đã được gán với thiết bị',
          icon: 'success',
          timer: 3000,
        });
      })
      .then(function () {
        navigate(0);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: 'Lỗi khi kích hoạt thiết bị',
          text: error.message || 'Đã có lỗi gì đó xảy ra',
          icon: 'error',
          showCloseButton: true,
        });
      });
  }

  useEffect(() => {
    if (userInfo) {
      setFullname(userInfo.fullname);
      setGenderChecked(userInfo.gender);
      setDateOfBirth(userInfo.dateOfBirth);
      setHeight(userInfo.height);
      setWeight(userInfo.weight);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  return (
    <Form heading={heading} subheading={subheading}>
      <>
        <div className="form-group">
          <label className="form-label" htmlFor="serialNumber">
            Số seri
          </label>
          <input
            value={serialNumber}
            id="serialNumber"
            type="text"
            className="form-input"
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="fullname">
            Họ và tên<span className="required">*</span>
          </label>
          <input
            required
            type="text"
            className="form-input"
            id="fullname"
            placeholder="Họ và tên"
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
            onBlur={handleBlurFullname}
          />
        </div>
        <div className="form-group">
          <span className="form-label">
            Giới tính<span className="required">*</span>
          </span>
          <div className="form-radio">
            {genderList.map((item) => (
              <div key={item.name} className="form-radio-group">
                <input
                  id={item.name}
                  checked={genderChecked === item.name}
                  type="radio"
                  onChange={() => setGenderChecked(item.name)}
                  className="form-radio-input"
                />
                <label htmlFor={item.name} className="form-radio-label">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="dateOfBirth">
            Ngày sinh<span className="required">*</span>
          </label>
          <input
            required
            type="date"
            className="form-input"
            id="dateOfBirth"
            placeholder="Ngày sinh"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            onBlur={handleBlurDateOfBirth}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="height">
            Chiều cao (cm)<span className="required">*</span>
          </label>
          <input
            required
            min={0}
            type="number"
            className="form-input"
            id="height"
            placeholder="Chiều cao"
            value={height || ''}
            onChange={(event) => setHeight(event.target.value)}
            onBlur={handleBlurHeight}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="weight">
            Cân nặng (kg)<span className="required">*</span>
          </label>
          <input
            required
            min={0}
            type="number"
            className="form-input"
            id="weight"
            placeholder="Cân nặng"
            value={weight || ''}
            onChange={(event) => setWeight(event.target.value)}
            onBlur={handleBlurWeight}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email<span className="required">*</span>
          </label>
          <input
            required
            autoComplete="on"
            type="email"
            className="form-input"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={handleBlurEmail}
          />
        </div>
        {hasTerms && (
          <div className="form-group">
            <div className="form-checkbox">
              <input
                checked={terms}
                className="form-checkbox-input"
                type="checkbox"
                id="terms"
                onChange={(e) => setTerms(e.target.checked)}
              />
              <span className="form-checkbox-label">
                Tôi đồng ý với <a href="#">điều khoản và chính sách</a> về sử dụng thiết bị và các
                dịch vụ RHM cung cấp.
              </span>
            </div>
          </div>
        )}
        <div className="form-group form-group-rightalign">
          {onBack && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="btn btn-secondary"
            >
              Quay lại
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSubmitForm}>
            Xác nhận
          </button>
        </div>
        {errorText && <p className="error">{errorText}</p>}
      </>
      {loading && (
        <div className="loading loading-absolute">
          <ReactLoading type="spin" width="12%" height="12%" color="#047D95" />
        </div>
      )}
    </Form>
  );
};

UpdateForm.propTypes = {
  serialNumber: PropTypes.string.isRequired,
  userInfo: PropTypes.object,
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  hasTerms: PropTypes.bool,
  onBack: PropTypes.func,
};

export default UpdateForm;
