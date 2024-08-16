import { Grid, TextareaAutosize } from '@mui/material';
import './App.css'

function App() {

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextareaAutosize minRows={20} />
        </Grid>
        <Grid item xs={6}>
          <TextareaAutosize minRows={20} />
        </Grid>
      </Grid>
    </>
  )
}

export default App
