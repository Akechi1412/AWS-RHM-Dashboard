/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Tabs } from '@aws-amplify/ui-react';
import RealtimeTab from './realtimeTab';
import SessionsTab from './sessionsTab';

const DataTabs = ({ serialNumber, searchParams, setSearchParams }) => {
  const [tab, setTab] = useState(searchParams.get('tab') || '1');
  const [sessionIdList, setSessionIdList] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [sessionData, setSessionData] = useState(new Map());
  const [callSessionIdList, setCallSessionIdList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [ecgData, setEcgData] = useState([]);

  function handleSelectSession(sessionId) {
    setSessionId(sessionId);
  }

  function handleRefresh() {
    setCallSessionIdList(false);
    setSessionIdList([]);
    setSessionData(new Map());
  }

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

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== tab) {
      setTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  }, [tab]);

  useEffect(() => {
    if (!serialNumber) return;

    const socket = new WebSocket(
      'wss://jnit54qdh9.execute-api.ap-southeast-1.amazonaws.com/production/'
    );

    socket.onopen = () => {
      console.log('Websocket opened');
      const data = {
        action: 'sendMessage',
        message: serialNumber,
      };
      socket.send(JSON.stringify(data));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const data = response.data;
      console.log(data);
      const timestamp = data.timestamp['N'];
      const mainData = data.main['M'];
      if (mainData.temperature['N']) {
        setTemperatureData((temperatureData) => {
          if (temperatureData.length >= 100) {
            temperatureData.shift();
          }
          return [
            ...temperatureData,
            {
              timestamp: formatTimestamp(timestamp),
              temperature: Number(mainData.temperature['N']).toFixed(2),
            },
          ];
        });
      } else if (mainData.heartRate['N']) {
        setHeartRateData((heartRateData) => {
          if (heartRateData.length >= 100) {
            heartRateData.shift();
          }
          return [
            ...heartRateData,
            {
              timestamp: formatTimestamp(timestamp),
              heartRate: Number(mainData.heartRate['N']),
              spo2: Number(mainData.spo2['N']).toFixed(2),
            },
          ];
        });
      } else if (mainData.ecgBlock['L'].length > 0) {
        setEcgData((ecgData) => {
          if (ecgData.length >= 2500) {
            ecgData = ecgData.slice(25);
          }
          const ecgItems = mainData.ecgBlock['L'].map((item, index) => ({
            timestamp: formatTimestamp(+timestamp + 4 * index),
            ecg: Number(item['N']),
          }));
          return [...ecgData, ...ecgItems];
        });
      }
    };

    socket.onclose = () => {
      console.log('Websocket closed');
    };

    return () => {
      socket.close();
    };
  }, [serialNumber]);

  useEffect(() => {
    if (tab !== '2') return;
    if (callSessionIdList) return;

    setLoading(true);
    axios
      .get(
        `https://ergl12vkg5.execute-api.ap-southeast-1.amazonaws.com/production/sessionId?serialNumber=${serialNumber}`
      )
      .then(function (response) {
        setSessionIdList(response.data?.sessionIdList || []);
        setCallSessionIdList(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setCallSessionIdList(true);
        setLoading(false);
      });
  }, [serialNumber, tab, callSessionIdList]);

  useEffect(() => {
    if (!sessionId || sessionIdList.length === 0) return;
    if (sessionData.has(sessionId)) return;

    setLoading(true);
    axios
      .get(
        `https://ergl12vkg5.execute-api.ap-southeast-1.amazonaws.com/production/details?serialNumber=${serialNumber}&sessionId=${sessionId}`
      )
      .then(function (response) {
        setSessionData((map) => {
          map.set(sessionId, response.data?.details);
          return map;
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [sessionId, sessionIdList]);

  return (
    <Tabs
      className="tabs"
      value={tab}
      onValueChange={(tab) => setTab(tab)}
      items={[
        {
          label: 'Realtime',
          value: '1',
          content: (
            <RealtimeTab
              temperatureData={temperatureData}
              heartRateData={heartRateData}
              ecgData={ecgData}
            />
          ),
        },
        {
          label: 'Tất cả',
          value: '2',
          content: (
            <>
              {loading ? (
                <div className="loading">
                  <ReactLoading type="spin" width="4%" height="4%" color="#047D95" />
                </div>
              ) : (
                <SessionsTab
                  sessionIdList={sessionIdList}
                  sessionId={sessionId}
                  sessionData={sessionData}
                  onSelectSession={handleSelectSession}
                  onRefresh={handleRefresh}
                />
              )}
            </>
          ),
        },
      ]}
      isLazy
    />
  );
};

DataTabs.propTypes = {
  serialNumber: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};

export default DataTabs;
