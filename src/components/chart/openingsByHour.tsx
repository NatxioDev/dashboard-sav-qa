import { CartesianGrid, Legend, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useEffect, useState } from "react";




export default function ChartOpeningByHours({ dataEntry }: { dataEntry: any[] }) {

    const [chartData, setChartData] = useState<any[]>([]);

    const chartConfig = {
        desktop: {
            label: "Apertura",
            color: "#7300ff",
        },
    } satisfies ChartConfig


    function agruparPorIntervalo(data: any[], intervalMinutes: number = 30): { interval: string, ag: number, as: number }[] {
        if (data.length === 0) return [];

        const conteoPorIntervalo: Record<string, { ag: number, as: number }> = {};

        data.forEach((item: any) => {
            const date = new Date(item.dateregister);
            date.setSeconds(0, 0); // Resetea segundos y milisegundos

            // Redondear la hora al intervalo parametrizable
            const minutos = date.getMinutes();
            const minutosRedondeados = Math.floor(minutos / intervalMinutes) * intervalMinutes;
            date.setMinutes(minutosRedondeados);

            // Formatear la hora en formato HH:mm
            const clave = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            // Inicializar conteo si no existe
            if (!conteoPorIntervalo[clave]) {
                conteoPorIntervalo[clave] = { ag: 0, as: 0 };
            }

            // Incrementar contadores basados en el valor de 'linkerreference'
            if (item.linkerreference === null) {
                conteoPorIntervalo[clave].ag++;
            } else {
                conteoPorIntervalo[clave].as++;
            }
        });

        // Convertir el objeto en un array y ordenar de mayor a menor por la hora
        return Object.entries(conteoPorIntervalo)
            .map(([interval, { ag, as }]) => ({
                interval,
                ag,
                as
            }))
            .sort((a, b) => a.interval.localeCompare(b.interval));
    }



    // const orderData = (data: any) => {
    //     const orderedData = data.sort((a: any, b: any) => {
    //         return new Date(a.interval).getTime() - new Date(b.interval).getTime();
    //     });
    //     return orderedData;
    // }

    // const formatData = (data: any) => {
    //     const formattedData = data.map((item: any) => {
    //         const date = new Date(item.interval);
    //         const hour = date.getHours();
    //         const minutes = date.getMinutes();
    //         const formattedHour = `${hour}:${minutes === 0 ? '00' : minutes}`;
    //         return { ...item, interval: formattedHour };
    //     });
    //     return formattedData;
    // }


    useEffect(() => {

        if (dataEntry.length === 0) {
            return;
        } else {
            const test = agruparPorIntervalo(dataEntry);
            // const order = orderData(test);

            // console.log('Hey', order)

            // const formattedData = formatData(order);
            setChartData(test);
        }
    }, [dataEntry]);





    return (
        <Card className="">
            <CardHeader>
                <CardTitle>
                    Aperturas por hora
                </CardTitle>
                <CardDescription>
                    Cantidad de aperturas por hora
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} style={{ height: '260px', width: '100%' }}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 2,
                            right: 2,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="interval"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tickSize={5}
                            accentHeight={0}
                            
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent labelKey="desktop" nameKey="interval" />}
                        />
                        <Legend />
                        <Line
                            dataKey="ag"
                            type="linear"
                            stroke="#7200fd"
                            strokeWidth={3}
                            dot={true}
                            name="Autogestionado"
                        />
                        <Line
                            dataKey="as"
                            type="linear"
                            stroke="#fda300"
                            strokeWidth={3}
                            name="Asesor"
                            dot={true}
                        />
                    </LineChart>
                </ChartContainer>

            </CardContent>

        </Card>
    )
}