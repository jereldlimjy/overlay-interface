import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {useActiveWeb3React} from '../../hooks/web3'
import {ClientCookies} from '../TermsOfServiceModal/TermsOfServiceModal'
// import useAxios from 'axios-hooks'
import {makeUseAxios} from 'axios-hooks'
import axios from 'axios'

export enum SecurityRiskLevels {
  SEVERE = 'SEVERE',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

const chainalysisBaseUrl = 'https://api.chainalysis.com/api/risk/v2/entities'
const mockSevereWalletAddress = '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c'
const config = {Token: process.env.REACT_APP_CHAINALYSIS_KEY_TEST}

const useAxios = makeUseAxios({
  axios: axios.create({baseURL: chainalysisBaseUrl}),
})

export default function ChainalysisManager({children}: {children: JSX.Element | JSX.Element[]}) {
  const {account} = useActiveWeb3React()
  const [cookies, setCookie] = useCookies([ClientCookies.userRiskLevel])

  const {userRiskLevel} = cookies

  // @TO-DO: use axios-hooks to manually trigger "GET" / "POST" requests to not perform unnecessary API calls
  // https://www.npmjs.com/package/axios-hooks
  const [{data: getRiskData, loading: getLoading, error: getError}, executeQuery] = useAxios(
    {
      url: mockSevereWalletAddress,
      config,
    },
    {manual: true},
  )

  useEffect(() => {
    executeQuery()
  }, [])

  // @TO-DO: useEffect to perform side effects on Chainanalysis "GET" request responses
  // if address has not been registered, perform "POST" request
  // if address returns response.risk value, set cookie with returned risk value

  // @TO-DO: check cookie on app initializing for any prior risk assessments
  useEffect(() => {
    // @TO-DO: remove if statement below; purely testing purposes
    if (account && !userRiskLevel) {
      const unserializedObj = {risk: SecurityRiskLevels.SEVERE, address: account}

      console.log('Chainalysis Manager: setting cookie to unserializedObj')
      setCookie(ClientCookies.userRiskLevel, JSON.stringify(unserializedObj))
    }
    if (!account) {
      console.log('Chainalysis Manager: no account currently connected')
    }
    // if (account && !userRiskLevel) {
    //   // perform "GET" request to check if registered
    //   console.log('Chainalysis Manager: no userRiskLevel cookie detected')
    // }
    if (userRiskLevel) {
      console.log('Chainanalysis Manager: current userRiskLevel cookie: ', userRiskLevel)
    }
  }, [account, setCookie, userRiskLevel])

  // @TO-DO: if cookie undefined, "GET" request chainanalysis API to check if address is registered
  // if response message property value is 'Entity not found. Please be sure to register the Entity',
  // we must register the account using a "POST" request to chainanalysis API.
  if (userRiskLevel === SecurityRiskLevels.SEVERE) return null

  return <>{children}</>
}