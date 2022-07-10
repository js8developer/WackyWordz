
import { Stack, CircularProgress } from '@mui/material';

export const MintingView = () => {
    return (
      <Stack className='header-container' direction='column' spacing={5}>
          <CircularProgress />
          <p className="sub-text">Minting your WackyWordz...please wait.</p>
      </Stack>
    );
  }