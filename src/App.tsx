import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from './components/ui/button';
import ChartOpeningByHours from './components/chart/openingsByHour';

// interface DataObject {
//   id: string;
//   dateregister: string;
//   datemodify: string;
//   customerGuid: string;
//   accountGuid: string;
//   documentContractId: string;
//   directoryId: string;
//   documentVoucherId: string | null;
//   interviewId: string;
//   deviceFingerprint: string;
//   hashReferenceNumber: string;
//   linkerreference: {
//     id: number;
//     guid: string;
//     rowcreator: string;
//     dateregister: string;
//     used: boolean;
//     channel: string;
//     agencyId: string;
//     personalCode: string;
//     email: string;
//     typeReference: string;
//   };
// }

function App() {

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
  const SECRET_ID = import.meta.env.VITE_SECRET_ID

  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoadedSegip, setIsLoadedSegip] = useState(false);

  const [steppersData, setSteppersData] = useState<any[]>([])

  const [allSteppersData, setAllSteppersData] = useState<any[]>([])

  const [startDate, setStartDate] = useState(new Date(new Date().setHours(0, 0, 0, 0) - 4 * 60 * 60 * 1000).toISOString().replace('Z', ''))
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().replace('Z', ''))

  const startDateSegip = (new Date('2025-02-21T00:00:00-04:00').toISOString().replace('Z', '-04:00'))
  const endDateSegip = (new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().replace('Z', ''))

  useEffect(() => {
    fetchData();
    fetchDataForSEGIP();

    // setSteppersData(testData)
    // setIsLoaded(false)

  }, []);


  const fetchData = async () => {
    try {
      setIsLoaded(true)
      const authResponse = await fetch('https://apis.dev.bancosol.net.bo/api/authorization/v1/access-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${SECRET_ID}`),
          'Cookie': 'cookiesession1=678A3EB53EC9BB86BF1416A41A204612'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials'
        })
      });

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      const reportResponse = await fetch('https://apis.prod.bancosol.net.bo/api/onboarding-ux/v1/Bsol/BusinessApiCdAhorrosBffApi/v1/ahorros/bff/get_report_query', {
        method: 'POST',
        headers: {
          'client_id': CLIENT_ID,
          'access_token': accessToken,
          'x-bol-device': '{"device":{"os":"Android","userAgent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36","deviceModel":"Unknown Model","language":"es-419","screenWidth":372,"screenHeight":866,"hardwareConcurrency":12},"sign":"497619cd5e36484f972e58e0a7202c18825b9d1b17df1da64b5217fbb4e48b42","stepperId":"985997f2-fe1c-4820-b713-aa9043517aa7"}',
          'Content-Type': 'application/json',
          'Cookie': 'cookiesession1=678A3EB9A1641B5040C8253912F937F0'
        },
        body: JSON.stringify({
          "startDate": startDate,
          "endDate": endDate
        })
      });

      const reportData = await reportResponse.json();

      setSteppersData(reportData);

      console.log(reportData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoaded(false)
    }



  };



  const fetchDataForSEGIP = async () => {
    try {
      setIsLoadedSegip(true)
      const authResponse = await fetch('https://apis.dev.bancosol.net.bo/api/authorization/v1/access-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${SECRET_ID}`),
          'Cookie': 'cookiesession1=678A3EB53EC9BB86BF1416A41A204612'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials'
        })
      });

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      const reportResponse = await fetch('https://apis.prod.bancosol.net.bo/api/onboarding-ux/v1/Bsol/BusinessApiCdAhorrosBffApi/v1/ahorros/bff/get_report_query', {
        method: 'POST',
        headers: {
          'client_id': CLIENT_ID,
          'access_token': accessToken,
          'x-bol-device': '{"device":{"os":"Android","userAgent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36","deviceModel":"Unknown Model","language":"es-419","screenWidth":372,"screenHeight":866,"hardwareConcurrency":12},"sign":"497619cd5e36484f972e58e0a7202c18825b9d1b17df1da64b5217fbb4e48b42","stepperId":"985997f2-fe1c-4820-b713-aa9043517aa7"}',
          'Content-Type': 'application/json',
          'Cookie': 'cookiesession1=678A3EB9A1641B5040C8253912F937F0'
        },
        body: JSON.stringify({
          "startDate": startDateSegip,
          "endDate": endDateSegip
        })
      });

      const reportData = await reportResponse.json();

      setAllSteppersData(reportData);

      console.log(reportData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadedSegip(false)
    }



  };

  const getAccountsOpened = () => {

    // return isLoaded ? 0 : steppersData.filter((stepper) => stepper.accountGuid != null || stepper.accountGuid != undefined || stepper.accountGuid != '').length;
    return steppersData.length;
  }

  const getSegipContingenciaAccounts = (data: any) => {
    const list = data.filter((stepper: any) => stepper.directoryId == 'No Segip' || stepper.directoryId == null);
    console.log(list)
    return list.length
  }



  // const getAccountsPerTime = () => {

  //   const intervals = 30 * 60 * 1000; // 30 minutes in milliseconds
  //   const accountsPerInterval = new Map();

  //   const intervalsArray = Array.from({ length: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / intervals) }, (_, i) => i * intervals);

  //   const final = []

  //   for (let i = 0; i < steppersData.length; i++) {
  //     const stepperTime = new Date(steppersData[i].dateregister).getTime();


  //     for (let e = 0; e < intervalsArray.length - 1; e++) {

  //       console.log("rim", intervalsArray[e], stepperTime)
  //       if (stepperTime >= intervalsArray[e] && stepperTime <= intervalsArray[e + 1]) {
  //         if (!accountsPerInterval.has(intervalsArray[e])) {
  //           accountsPerInterval.set(intervalsArray[e], 0);
  //         }
  //         accountsPerInterval.set(intervalsArray[e], accountsPerInterval.get(intervalsArray[e]) + 1);
  //       }
  //     }
  //   }

  //   console.log("accountsPerInterval", accountsPerInterval)

  // }


  // for (let i = 0; i < steppersData.length; i++) {
  //   const stepperTime = new Date(steppersData[i].dateregister).getTime();
  //   if (stepperTime >= new Date(startDate).getTime() && stepperTime <= new Date(endDate).getTime()) {
  //     const intervalKey = Math.floor(stepperTime / intervals) * intervals;
  //     if (!accountsPerInterval.has(intervalKey)) {
  //       accountsPerInterval.set(intervalKey, 0);
  //     }
  //     accountsPerInterval.set(intervalKey, accountsPerInterval.get(intervalKey) + 1);
  //   }
  // }

  // const final = Array.from(accountsPerInterval.entries()).map(([interval, count]) => ({
  //   interval: new Date(interval).toLocaleString(),
  //   count
  // }));

  // console.log("final", final)
  // return final;



  return (
    <div className="flex justify-center items-center h-screen w-screen bg-neutral-900">



      {isLoaded ? (
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>) : (

        <div className='grid grid-rows-3 mx-4 gap-4'>

          <div className='flex items-end gap-2'>
            <Button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {
                const today = new Date();
                setStartDate(new Date(today.setHours(0, 0, 0, 0) - 4 * 60 * 60 * 1000).toISOString().replace('Z', '-04:00'));
                setEndDate(new Date(today.setDate(today.getDate() + 1)).toISOString().replace('Z', '-04:00'));
                fetchData();
              }}
            >
              HOY
            </Button>
            <Button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              onClick={() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                setStartDate(new Date(yesterday.setHours(0, 0, 0, 0) - 4 * 60 * 60 * 1000).toISOString().replace('Z', '-04:00'));
                setEndDate(new Date(yesterday.setDate(yesterday.getDate() + 1)).toISOString().replace('Z', '-04:00'));
                fetchData();
              }}
            >
              AYER
            </Button>
            <Button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={() => {
                setStartDate(new Date(new Date().setHours(0, 0, 0, 0) - 4 * 60 * 60 * 1000).toISOString().replace('Z', ''))
                setEndDate(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().replace('Z', ''))
                fetchData();
              }}
            >
              ACTUALIZAR
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>


            <Card className=''>
              <CardHeader>
                <CardTitle>
                  Cantidad de cuentas aperturadas
                </CardTitle>
                <CardDescription>
                  <p className='text-sm'>Actualizado hasta: {new Date(new Date(endDate).getTime() - 4 * 60 * 60 * 1000).toLocaleString()}</p>
                  <p className="text-sm">Desde: {new Date(startDate).toLocaleString()}</p>
                </CardDescription>
              </CardHeader>
              <CardContent>

                <div className="text-8xl font-semibold ">
                  {getAccountsOpened()}
                </div>

              </CardContent>
            </Card>
            <Card className=''>
              <CardHeader>
                <CardTitle>
                  Cantidad de cuentas aperturadas bajo contingencia SEGIP
                </CardTitle>
                <CardDescription>
                  
                  <p className="text-sm">Desde: 21/02/2025</p>
                </CardDescription>
              </CardHeader>
              <CardContent>

                <div className="text-8xl font-semibold ">
                  {isLoadedSegip ? (
                    <svg className="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>

                  ) : getSegipContingenciaAccounts(allSteppersData)}



                </div>

              </CardContent>
            </Card>

            <div className=''>
              <ChartOpeningByHours dataEntry={steppersData} />
            </div>

          </div>

          <div>

          </div>
        </div>


      )


      }






    </div>
  )

}

export default App

