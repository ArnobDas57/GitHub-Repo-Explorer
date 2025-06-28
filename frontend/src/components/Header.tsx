import React from 'react'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { useContext } from 'react'


const Header = () => {
  return (
    <Box sx={{ padding: 2, backgroundColor: "rgb(242, 242, 221)" }}>
      <Typography variant="h2" color='rgb(19, 50, 61)'>Repo Explorer</Typography>
    </Box>
  )
}

export default Header