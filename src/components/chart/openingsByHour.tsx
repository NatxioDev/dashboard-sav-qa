import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useEffect, useState } from "react";




export default function ChartOpeningByHours({ dataEntry }: { dataEntry: any[] }) {

    const [chartData, setChartData] = useState<any[]>([]);

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#7300ff",
        },
    } satisfies ChartConfig


    function agruparPorIntervalo30Minutos(data: any): { interval: string, count: number }[] {

        const INTERVAL = 60

        if (data.length == 0) {
            return [];
            console.log("first", data);
        } else {



            console.log("second", data);
            const conteoPorIntervalo: Record<string, number> = {};

            data.forEach((item: any) => {
                const date = new Date(item.dateregister);
                date.setSeconds(0, 0); // Resetea segundos y milisegundos

                // Redondear la hora al intervalo de 30 minutos
                const minutos = date.getMinutes();
                const minutosRedondeados = minutos < INTERVAL ? 0 : INTERVAL;
                date.setMinutes(minutosRedondeados);

                const clave = date.toISOString()

                conteoPorIntervalo[clave] = (conteoPorIntervalo[clave] || 0) + 1;
            });



            return Object.entries(conteoPorIntervalo).map(([interval, count]) => ({ interval, count }));
        }
    }

    const orderData = (data: any) => {
        const orderedData = data.sort((a: any, b: any) => {
            return new Date(a.interval).getTime() - new Date(b.interval).getTime();
        });
        return orderedData;
    }

    const formatData = (data: any) => {
        const formattedData = data.map((item: any) => {
            const date = new Date(item.interval);
            const hour = date.getHours();
            const minutes = date.getMinutes();
            const formattedHour = `${hour}:${minutes === 0 ? '00' : minutes}`;
            return { ...item, interval: formattedHour };
        });
        return formattedData;
    }


    useEffect(() => {

        console.log('DataEntryu', typeof dataEntry);
        console.log('Data', dataEntry);
        if (dataEntry.length === 0) {
            console.log('Not')
            return;
        } else {
            console.log('Yes')
            const test = agruparPorIntervalo30Minutos(dataEntry);
            const order = orderData(test);
            const formattedData = formatData(order);
            setChartData(formattedData);
            console.log(formattedData);
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
                <ChartContainer config={chartConfig}>
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
                            tickMargin={0}
                            tickSize={0}
                            accentHeight={0}
                        // tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent labelKey="desktop" nameKey="interval" />}


                        />
                        <Line
                            dataKey="count"
                            type="linear"
                            stroke="var(--color-desktop)"
                            strokeWidth={3}
                            dot={true}
                        />
                    </LineChart>
                </ChartContainer>

            </CardContent>

        </Card>
    )
}