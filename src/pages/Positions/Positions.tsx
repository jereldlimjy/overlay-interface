import { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  Paper
} from '@material-ui/core';
import { 
  StyledContainer, 
  StyledTableCell, 
  StyledTableCellThin, 
  StyledTableRow,
  StyledTableHeaderRow, 
  StyledHeaderCell 
} from '../Markets/Markets';
import { useActiveWeb3React } from '../../hooks/web3';
import Loader from 'react-loader-spinner';
import { Trans } from '@lingui/macro';
import styled from 'styled-components/macro';
import { TEXT } from '../../theme/theme';
import { PlanckCatLoader } from '../../components/Loaders/Loaders';
import { Button } from 'rebass';
import { injected } from '../../connectors/connectors';

const LoadingContainer = styled.div`
  display: block;
`;

const ConnectWallet = styled(Button)`
  width: 100%;
  height: 33vh;
  cursor: pointer;
  background: none;

  :hover {
    opacity: 0.7;
  }
`;

const tableHeaders = [
  'Market',
  'Amt.',
  'Side',
  'Leverage',
  'Lock price',
  'Est. Liq.',
  'PnL'
];

const Positions = () => { 
  const { account, activate, chainId } = useActiveWeb3React();
  const [loading, setLoading] = useState(true);

  const connectWallet = () => {
    activate(injected);
  };

  return (
    <StyledContainer>
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHeaderRow>
            {tableHeaders.map((header, column) => (
              <StyledHeaderCell>
                {header}
              </StyledHeaderCell>
            ))}
          </StyledTableHeaderRow>
        </Table>
        <TableBody>
        </TableBody>
      </TableContainer>
      {account ? (
        <LoadingContainer>
          <PlanckCatLoader duration={5} width={24} />
          <PlanckCatLoader duration={5} width={24} />
          <PlanckCatLoader duration={5} width={24} />
        </LoadingContainer>
      ):(
        <LoadingContainer>
          <ConnectWallet onClick={connectWallet}>
            <strong>
              Please connect wallet
            </strong>
          </ConnectWallet>
        </LoadingContainer>
      )}
    </StyledContainer>
  )
};

export default Positions;