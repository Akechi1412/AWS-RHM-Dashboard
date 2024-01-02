import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const ChartList = ({ temperatureData, heartRateData, ecgData }) => {
  return (
    <div className="chart-list">
      <div className="chart">
        <h4 className="chart-title">Nhiệt độ cơ thể</h4>
        <>
          {temperatureData.length > 0 ? (
            <div className="chart-content">
              <ResponsiveContainer width="100%" aspect={2}>
                <LineChart
                  width={1000}
                  height={500}
                  data={temperatureData}
                  margin={{ top: 5, right: 5, left: -8, bottom: 5 }}
                >
                  <Line type="monotone" dataKey="temperature" stroke="#ed4337" dot={false} />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="timestamp" />
                  <YAxis type="number" domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Dữ liệu không được đo trong phiên này.</p>
          )}
        </>
      </div>
      <div className="chart">
        <h4 className="chart-title">Nhịp tim và nồng độ oxi trong máu (SpO2)</h4>
        <>
          {heartRateData.length > 0 ? (
            <div className="chart-content">
              <ResponsiveContainer width="100%" aspect={2}>
                <LineChart data={heartRateData} margin={{ top: 5, right: 5, left: -8, bottom: 5 }}>
                  <Line type="monotone" dataKey="heartRate" stroke="#ed4337" dot={false} />
                  <Line type="monotone" dataKey="spo2" stroke="#ff9900" dot={false} />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="timestamp" />
                  <YAxis type="number" domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>Dữ liệu không được đo trong phiên này.</div>
          )}
        </>
      </div>
      <div className="chart">
        <h4 className="chart-title">Điện tâm đồ</h4>
        <>
          {ecgData.length > 0 ? (
            <div className="chart-content">
              <ResponsiveContainer width="100%" aspect={2}>
                <LineChart data={ecgData} margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
                  <Line type="monotone" dataKey="ecg" stroke="#ff9900" dot={false} />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="timestamp" />
                  <YAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Dữ liệu không được đo trong phiên này.</p>
          )}
        </>
      </div>
    </div>
  );
};

ChartList.propTypes = {
  temperatureData: PropTypes.arrayOf(PropTypes.object).isRequired,
  heartRateData: PropTypes.arrayOf(PropTypes.object).isRequired,
  ecgData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ChartList;
