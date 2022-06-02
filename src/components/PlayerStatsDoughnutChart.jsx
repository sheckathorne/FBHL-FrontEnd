import 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import ChartDeferred from 'chartjs-plugin-deferred';

const PlayerStatsDoughnutChart = ({ chartData, chartColors }) => {
  const data = {
    labels: Object.keys(chartData),
    datasets: [
      {
        data: Object.values(chartData),
        backgroundColor: Object.values(chartColors),
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      deferred: {
        delay: 250,
        xOffset: '100%',
        yOffset: '100%'
      }
    }
  }

  return (
    <>
      <Chart type='doughnut' data={data} options={options} plugins={[ChartDeferred]} />
    </>
  )
}

export default PlayerStatsDoughnutChart