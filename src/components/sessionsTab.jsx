import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChartList from '../components/chartList';

const SessionsTab = ({ sessionIdList, sessionId, sessionData, onSelectSession, onRefresh }) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [ecgData, setEcgData] = useState([]);

  useEffect(() => {
    if (!sessionId) return;
    const data = sessionData.get(sessionId);
    if (!data) return;

    setTemperatureData([]);
    setHeartRateData([]);
    setEcgData([]);

    if (data.temperatureData?.length > 0) {
      setTemperatureData(() => {
        return data.temperatureData.map((item) => ({
          timestamp: formatTimestamp(item.timestamp),
          temperature: Number(item.main.temperature).toFixed(2),
        }));
      });
    }
    if (data.heartRateData?.length > 0) {
      setHeartRateData(() => {
        return data.heartRateData.map((item) => ({
          timestamp: formatTimestamp(item.timestamp),
          heartRate: Number(item.main.heartRate),
          spo2: Number(item.main.spo2).toFixed(2),
        }));
      });
    }
    if (data.ecgBlockData.length > 0) {
      setEcgData(() => {
        return data.ecgBlockData.reduce((accumulator, current) => {
          const ecgItems = current.main.ecgBlock.map((item, index) => ({
            timestamp: formatTimestamp(+current.timestamp + 4 * index),
            ecg: Number(item),
          }));
          return [...accumulator, ...ecgItems];
        }, []);
      });
    }
  }, [sessionId, sessionData]);

  function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp));
    const optionsTime = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      fractionalSecondDigits: 3,
    };
    const formatterTime = new Intl.DateTimeFormat('vi-VN', optionsTime);
    return formatterTime.format(date);
  }

  function formatSessionId(sessionId) {
    const date = new Date(Number(sessionId));
    const optionsDate = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    };

    const optionsTime = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    };

    const formatterDate = new Intl.DateTimeFormat('vi-VN', optionsDate);
    const formatterTime = new Intl.DateTimeFormat('vi-VN', optionsTime);

    const formattedDate = formatterDate.format(date);
    const formattedTime = formatterTime.format(date);

    return `${formattedDate} - ${formattedTime}`;
  }

  return (
    <>
      {!sessionId ? (
        <>
          <h3 className="session-title">Lần đo</h3>
          <div className="session-action">
            <button onClick={() => onRefresh()} className="btn btn-primary">
              Làm mới
            </button>
          </div>
          <>
            {sessionIdList.length > 0 ? (
              <div className="card-list">
                {sessionIdList.map((sessionId) => (
                  <div
                    onClick={() => {
                      onSelectSession(sessionId);
                    }}
                    key={sessionId}
                    className="card"
                  >
                    <span>{formatSessionId(sessionId)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Thiết bị này chưa thực hiện lần đo nào.</p>
            )}
          </>
        </>
      ) : (
        <>
          <h3 className="session-title">Lần đo: {formatSessionId(sessionId)}</h3>
          <div className="session-action">
            <button onClick={() => onRefresh()} className="btn btn-primary">
              Làm mới
            </button>
            <button onClick={() => onSelectSession('')} className="btn btn-secondary">
              Quay lại
            </button>
          </div>
          <ChartList
            temperatureData={temperatureData}
            heartRateData={heartRateData}
            ecgData={ecgData}
          />
        </>
      )}
    </>
  );
};

SessionsTab.propTypes = {
  sessionIdList: PropTypes.arrayOf(PropTypes.string).isRequired,
  sessionId: PropTypes.string.isRequired,
  sessionData: PropTypes.object.isRequired,
  onSelectSession: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default SessionsTab;
