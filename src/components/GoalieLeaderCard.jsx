import { useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import ThemeContext from './ThemeContext'
import HorizontalDivider from './HorizontalDivider'
import GoalieDetailStatRow from './GoalieDetailStatRow'

const GoalieLeaderCard = ({ homeTeamGoalie, awayTeamGoalie }) => {
  const lightTheme = useContext(ThemeContext).value === 'light'
  const statArr = [
     { id: 1, title: 'Time On Ice', statName: 'toi' },
     { id: 2, title: 'Goals Allowed', statName: 'goalsAllowed' },
     { id: 3, title: 'Shots Faced', statName: 'shotsFaced' },
     { id: 4, title: 'Saves', statName: 'saves' },
  ]
  
  return (
    <>
      <HorizontalDivider width='11'/>
      <Row className='match-detail-text'><Col><h5 className={lightTheme ? '' : 'dark-theme-text'}>Goalies</h5></Col></Row>
      <Row className='match-detail-text'>
        <Col xs={3} className='my-auto text-start'>
          <h6 className={lightTheme ? '' : 'dark-theme-text'}><small>{homeTeamGoalie.playerName}</small></h6>
        </Col>
        <Col xs={{ span: 3, offset: 6}} className='my-auto text-end'>
          <h6 className={lightTheme ? '' : 'dark-theme-text'}><small>{awayTeamGoalie.playerName}</small></h6>
        </Col>
      </Row>
      {
        statArr.map(stat => 
          <GoalieDetailStatRow
            key={stat.id}
            title={stat.title}
            homeTeamStat={homeTeamGoalie[`${stat.statName}`]}
            awayTeamStat={awayTeamGoalie[`${stat.statName}`]}
            lightTheme={lightTheme}
          />
         )
      }
    </>
  )
}

export default GoalieLeaderCard