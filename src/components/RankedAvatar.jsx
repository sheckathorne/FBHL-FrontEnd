import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp'

const RankedAvatar = ({ rank }) => {
  const smallAvatarBgcolor = '#404040'
  const bigAvatarBgcolor = '#0d6efd'
  const colors = [{ rank: 1, color: '#FFD700' },{ rank: 2, color: '#C0C0C0' },{ rank: 3, color: '#cd7f32' }]

  const badge = (rank) =>  (
    <Badge
      overlap='circular'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <Avatar sx={{ bgcolor: `${smallAvatarBgcolor}`, height: '20px', width: '20px', border: '1px solid white' }}>
          <EmojiEventsSharpIcon sx={{ fontSize: 12,  color: `${colors.find(color => color.rank === rank).color}`, bgcolor: `${smallAvatarBgcolor}` }}/>
        </Avatar>
      }
    >
      <Avatar sx={{ bgcolor: `${bigAvatarBgcolor}`, border: '2px solid white' }}>{rank}</Avatar>
    </Badge>
  )

  const avatar = ( rank >= 1 && rank <= 3 ) ? badge(rank): <Avatar sx={{ bgcolor: `${bigAvatarBgcolor}`, border: '2px solid white' }}>{rank}</Avatar>

  return (
    <>
      <Row>
        <Col className='d-flex justify-content-center'>
          {avatar}
        </Col>
      </Row>
    </>
  )
}
export default RankedAvatar