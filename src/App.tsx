import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import ChartOpeningByHours from './components/chart/openingsByHour';
import ChartOpeningsByType from './components/chart/openingsByType';
// import { testData } from './components/chart/test.ts';


function App() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const SECRET_ID = import.meta.env.VITE_SECRET_ID;

  const [date, setDate] = useState<Date>(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [steppersData, setSteppersData] = useState<any[]>([]);

  const formatDate = (date: Date, endOfDay = false) => {
    const adjustedDate = new Date(date);
    if (endOfDay) adjustedDate.setHours(23, 59, 59, 999);
    else adjustedDate.setHours(0, 0, 0, 0);
    return new Date(adjustedDate.getTime() - 4 * 60 * 60 * 1000).toISOString().replace('Z', '-04:00');
  };

  const fetchData = async (startDate: string, endDate: string) => {
    try {
      setIsLoaded(true);
      const authResponse = await fetch('https://apis.prod.bancosol.net.bo/api/authorization/v1/access-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${SECRET_ID}`),
        },
        body: new URLSearchParams({ 'grant_type': 'client_credentials' }),
      });

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      const reportResponse = await fetch('https://apis.prod.bancosol.net.bo/api/onboarding-ux/v1/Bsol/BusinessApiCdAhorrosBffApi/v1/ahorros/bff/get_report_query', {
        method: 'POST',
        headers: {
          'client_id': CLIENT_ID,
          'access_token': accessToken,
          'x-bol-device': JSON.stringify({
            device: {
              os: "Android",
              userAgent: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
              deviceModel: "Unknown Model",
              language: "es-419",
              screenWidth: 372,
              screenHeight: 866,
              hardwareConcurrency: 12
            },
            sign: "497619cd5e36484f972e58e0a7202c18825b9d1b17df1da64b5217fbb4e48b42",
            stepperId: "985997f2-fe1c-4820-b713-aa9043517aa7"
          }),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate, endDate })
      });

      const reportData = await reportResponse.json();
      console.log(reportData)
      setSteppersData(reportData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    const initialStartDate = formatDate(new Date());
    const initialEndDate = formatDate(new Date(), true);
    fetchData(initialStartDate, initialEndDate);

    // console.log(testData)
    // setSteppersData(testData);

  }, []);

  const getAccountsOpened = () => steppersData;
  const getLinkReferenceCount = () => steppersData.filter((step) => step.linkerreference != null);
  const getWithoutDocumentContractIdCount = () => steppersData.filter((step) => step.documentContractId == null);

  return (
    <div className="p-2 bg-neutral-900  min-h-screen">
      <div className="mx-2 my-5 ">

        <div>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="">
                  <CalendarIcon className="mr-2" />
                  {date ? format(date, 'dd/MM/yyyy') : 'Selecciona una fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="">
                <Calendar mode="single" selected={date} onSelect={(day) => day && setDate(day)} />
              </PopoverContent>
            </Popover>
            <Button
              className="bg-purple-600 hover:bg-purple-500"
              onClick={() => fetchData(formatDate(date || new Date(), false), formatDate(date || new Date(), true))}
            >
              Actualizar
            </Button>
          </div>
          <div className="mt-4 text-white">
            {isLoaded ? (
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (getAccountsOpened().length == 0 ? <div>No hay datos</div> :
              <div>
                <div className='my-2 font-semibold'>
                  Actualizado a: {new Date(getAccountsOpened()[0].dateregister).toLocaleDateString()}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
                  <ChartOpeningsByType dataEntry={
                    [
                      {
                        name: 'Autogestionado',
                        value: getAccountsOpened().length - getLinkReferenceCount().length,
                        fill: '#7200fd'
                      },
                      {
                        name: 'Asesor',
                        value: getLinkReferenceCount().length,
                        fill: '#fda300'
                      }
                    ]} />

                  <ChartOpeningByHours dataEntry={getAccountsOpened()} />
                </div>
              </div>

            )}
          </div>
        </div>
      </div>
      <div>
        <span className='text-white'>SIN DOCUMENTID {getWithoutDocumentContractIdCount().length}</span>
      </div>
    </div>


  );
}

export default App;
