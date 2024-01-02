import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Form from '../components/form';
import UpdateForm from '../components/updateForm';
import Dropdown from '../components/dropdown';
import DataTabs from '../components/dataTabs';
import logo from '../images/logo.png';

const DevicePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [serialNumber, setSerialNumber] = useState('');
  const [responseSerialNumber, setResponseSerialNumber] = useState('');
  const [serialInput, setSerialInput] = useState('');
  const [validDevice, setValidDevice] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [activatedDevice, setActivatedDevice] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  function handleChangeSerialInput(event) {
    setSerialInput(event.target.value);
  }

  function handleSubmitSerialInput(event) {
    event.preventDefault();
    if (serialInput.trim() === '') {
      setErrorText('Chưa nhập số Seri.');
      return;
    }
    setSerialNumber(serialInput);
  }

  function handleBack() {
    setSerialNumber('');
    navigate('/device');
  }

  useEffect(() => {
    const serialNumberParam = searchParams.get('serialNumber');
    if (serialNumberParam) {
      setSerialNumber(searchParams.get('serialNumber'));
    }
    if (!serialNumber) {
      searchParams.delete('serialNumber');
      setSearchParams(searchParams);
      setLoading(false);
      return;
    }
    if (serialNumberParam && serialNumber === responseSerialNumber) {
      return;
    }

    setLoading(true);
    axios
      .get(
        `https://lu6zgo0804.execute-api.ap-southeast-1.amazonaws.com/production/device?serialNumber=${serialNumber}`
      )
      .then(function (response) {
        setLoading(false);
        const device = response.data?.device;
        if (device != null) {
          setResponseSerialNumber(serialNumber);
          setValidDevice(true);
          searchParams.set('serialNumber', serialNumber);
          setSearchParams(searchParams);
        } else {
          setValidDevice(false);
          setErrorText('Không tìm thấy thiết bị, vui lòng thử lại.');
          searchParams.delete('serialNumber');
          setSearchParams(searchParams);
        }

        if (device?.isActivated) {
          setActivatedDevice(true);
          setUserInfo(device.userInfo);
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorText(error.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
      });
  }, [serialNumber, responseSerialNumber, searchParams, setSearchParams]);

  return (
    <>
      {loading ? (
        <div className="loading loading-screen">
          <ReactLoading type="cylon" width="10%" height="10%" color="#047D95" />
        </div>
      ) : (
        <>
          {serialNumber && validDevice ? (
            <>
              {activatedDevice ? (
                <>
                  <header className="header">
                    <div className="container">
                      <div className="header-inner">
                        <a href="/device" className="logo">
                          <img width={40} height={40} className="logo-img" src={logo} alt="RHM" />
                        </a>
                        <h1 className="heading">Remote Health Monitoring</h1>
                        <Dropdown title="Thiết bị">
                          <>
                            <div
                              onClick={() => setShowEditForm(true)}
                              className="dropdown-menu-item"
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                              <span>Chỉnh sửa</span>
                            </div>
                            <div onClick={handleBack} className="dropdown-menu-item">
                              <FontAwesomeIcon icon={faArrowRightFromBracket} />
                              <span>Thoát</span>
                            </div>
                          </>
                        </Dropdown>
                      </div>
                    </div>
                  </header>
                  <main>
                    <div className="container">
                      <div className="monitoring">
                        <div className="monitoring-header">
                          <h2 className="monitoring-heading">Thiết bị: {serialNumber}</h2>
                        </div>
                        <DataTabs
                          serialNumber={serialNumber}
                          searchParams={searchParams}
                          setSearchParams={setSearchParams}
                        />
                      </div>
                    </div>
                  </main>
                </>
              ) : (
                <div className="overlay">
                  <UpdateForm
                    serialNumber={serialNumber}
                    heading="Kích hoạt thiết bị"
                    subheading="Thiết bị này chưa được kích hoạt, vui lòng điền đầy đủ các thông tin bên dưới để kích hoạt thiết bị"
                    hasTerms
                    onBack={handleBack}
                  ></UpdateForm>
                </div>
              )}
            </>
          ) : (
            <div className="overlay">
              <Form heading="Nhập số Seri của thiết bị">
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="serialInput">
                      Số seri<span className="required">*</span>
                    </label>
                    <input
                      onChange={handleChangeSerialInput}
                      value={serialInput}
                      id="serialInput"
                      type="text"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group form-group-rightalign">
                    <button className="btn btn-primary" onClick={handleSubmitSerialInput}>
                      Xác nhận
                    </button>
                  </div>
                  {errorText && <p className="error">{errorText}</p>}
                </>
              </Form>
            </div>
          )}
        </>
      )}
      {showEditForm && (
        <div className="overlay">
          <UpdateForm
            serialNumber={serialNumber}
            userInfo={userInfo}
            heading="Chỉnh sửa thông tin cá nhân"
            onBack={() => setShowEditForm(false)}
          ></UpdateForm>
        </div>
      )}
    </>
  );
};

export default DevicePage;
