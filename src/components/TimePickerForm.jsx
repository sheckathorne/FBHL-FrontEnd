import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material' 

const TimePickerForm = ({ timePick, setTimePick, themeMode='light' }) => {
  const darkTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={darkTheme}>
        <TimePicker
          label="Select time"
          value={timePick}
          onChange={(newValue) => {
            setTimePick(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
          openTo='hours'
          toolbarTitle={null}
          ampmInClock={true}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default TimePickerForm