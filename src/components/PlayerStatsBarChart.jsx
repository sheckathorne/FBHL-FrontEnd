import 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import ChartDeferred from 'chartjs-plugin-deferred'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const PlayerStatsBarChart = ({ chartData, chartColors, title, clearStat }) => {
  const colors = chartData.map(player => {
    if ( player.isSelectedPlayer ) {
      return chartColors['bar-darkOrange']
    } else if ( player.playerName === 'Average' ) {
      return chartColors['bar-blue']
    } else {
      return chartColors['bar-lightOrange']
    }
  })
  
  const data = {
    labels: chartData.map(player => player.playerName),
    datasets: [{
      data: chartData.map(player => player.value),
      backgroundColor: colors
    }]
  }

  const options = {
    layout: {
      padding: {
        top: 15
      }
    },
    responsive: true,
    hover: {
      animationDuration: 0
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false
      }
    },
    plugins: {
      tooltip: {
        enabled: false
      },
      title: {
        align: 'center',
        position: 'top',
        display: true,
        text: title
      },
      legend: {
        display: false
      },
      deferred: {
        delay: 250,
        xOffset: '75%',
        yOffset: '75%'
      },
      datalabels: {
        color: 'black',
        anchor: 'end',
        align: 'end'
      }
    }
  }

  return (
    <>
      <Chart type='bar' data={data} options={options} plugins={[ChartDeferred, ChartDataLabels]} onClick={() => clearStat()} />
    </>
  )
}

export default PlayerStatsBarChart