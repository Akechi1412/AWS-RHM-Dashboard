import PropTypes from 'prop-types';
import ChartList from '../components/chartList';

const RealtimeTab = ({ temperatureData, heartRateData, ecgData }) => {
  return (
    <ChartList temperatureData={temperatureData} heartRateData={heartRateData} ecgData={ecgData} />
  );
};

RealtimeTab.propTypes = {
  temperatureData: PropTypes.array.isRequired,
  heartRateData: PropTypes.array.isRequired,
  ecgData: PropTypes.array.isRequired,
};

export default RealtimeTab;
