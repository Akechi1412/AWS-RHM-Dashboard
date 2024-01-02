/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { withAuthenticator } from '@aws-amplify/ui-react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLaptopMedical,
  faArrowRightFromBracket,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Form from '../components/form';
import Dropdown from '../components/dropdown';
import DataTabs from '../components/dataTabs';
import logo from '../images/logo.png';

const HomePage = ({ user, signOut }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deviceList, setDeviceList] = useState([]);
  const [deviceMap, setDeviceMap] = useState(new Map());
  const [serialNumber, setSerialNumber] = useState(searchParams.get('serialNumber') || '');
  const [loading, setLoading] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const serialParam = searchParams.get('serialNumber');
    if (serialParam && serialParam !== serialNumber) {
      setSerialNumber(serialParam);
    }
  }, [searchParams]);

  useEffect(() => {
    searchParams.set('serialNumber', serialNumber);
    setSearchParams(searchParams);
  }, [serialNumber]);

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://lu6zgo0804.execute-api.ap-southeast-1.amazonaws.com/production')
      .then(function (response) {
        const _deviceList = response.data.deviceList;
        setDeviceList(_deviceList);
        const _deviceMap = _deviceList.reduce((map, obj) => {
          if ('serialNumber' in obj) {
            map.set(obj.serialNumber, { ...obj });
          }
          return map;
        }, new Map());
        setDeviceMap(_deviceMap);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading loading-screen">
          <ReactLoading type="cylon" width="10%" height="10%" color="#047D95" />
        </div>
      ) : (
        <>
          <header className="header">
            <div className="container">
              <div className="header-inner">
                <a href="/" className="logo">
                  <img width={40} height={40} className="logo-img" src={logo} alt="RHM" />
                </a>
                <h1 className="heading">Remote Health Monitoring</h1>
                <Dropdown title={`Chào, ${user?.username || 'Admin'}`}>
                  <>
                    <div className="dropdown-menu-item">
                      <FontAwesomeIcon icon={faUser} />
                      <span>Profile</span>
                    </div>
                    <div className="dropdown-menu-item">
                      <FontAwesomeIcon icon={faLaptopMedical} />
                      <span>Thiết bị</span>
                    </div>
                    <div onClick={signOut} className="dropdown-menu-item">
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      <span>Đăng xuất</span>
                    </div>
                  </>
                </Dropdown>
              </div>
            </div>
          </header>
          <main>
            <div className="container">
              {!serialNumber ? (
                <div className="device">
                  <h2 className="device-heading">Danh sách thiết bị</h2>
                  <>
                    {deviceList.length !== 0 ? (
                      <div className="card-list">
                        {deviceList.map((device) => (
                          <div
                            onClick={() => {
                              if (device.isActivated) {
                                setSerialNumber(device.serialNumber);
                              }
                            }}
                            key={device.serialNumber}
                            className={`card ${device.isActivated ? '' : 'card-disabled'}`}
                          >
                            <span style={{ fontWeight: 500 }}>{device.serialNumber}</span>
                            {device.isActivated ? (
                              <span>BN: {device.userInfo?.fullname}</span>
                            ) : (
                              <span style={{ color: '#ed4337' }}>Chưa kích hoạt</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Chưa có thiết bị nào.</p>
                    )}
                  </>
                </div>
              ) : (
                <div className="monitoring">
                  <div className="monitoring-header">
                    <h2 className="monitoring-heading">Thiết bị: {serialNumber}</h2>
                    <div
                      onClick={() => {
                        setSerialNumber('');
                        searchParams.set('serialNumber', '');
                        searchParams.delete('tab');
                        setSearchParams(searchParams);
                      }}
                      className="monitoring-back"
                    >
                      <FontAwesomeIcon icon={faRotateLeft} />
                    </div>
                  </div>
                  <div className="monitoring-info">
                    <p className="monitoring-info-item">
                      Bệnh nhân: {deviceMap.get(serialNumber)?.userInfo?.fullname}
                    </p>
                    <p className="monitoring-info-item">
                      <span>
                        Giới tính:{' '}
                        {deviceMap.get(serialNumber)?.userInfo?.gender === 'male' ? 'Nam' : 'Nữ'}
                      </span>
                      <span>
                        Ngày sinh: {formatDate(deviceMap.get(serialNumber)?.userInfo?.dateOfBirth)}
                      </span>
                    </p>
                    <p className="monitoring-info-item">
                      <span>Chiều cao: {deviceMap.get(serialNumber)?.userInfo?.height} cm</span>
                      <span>Cân nặng: {deviceMap.get(serialNumber)?.userInfo?.weight} kg</span>
                    </p>
                  </div>
                  <DataTabs
                    serialNumber={serialNumber}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </>
  );
};

HomePage.propTypes = {
  user: PropTypes.object,
  signOut: PropTypes.func,
};

export default withAuthenticator(HomePage);
