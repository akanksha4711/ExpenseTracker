import React from "react";
import { BarChart, Bar, XAxis, YAxis, Text, Cell, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

const YAxisLeftTick = ({ y, payload: { value } }) => {
    return (
      <Text x={0} y={y} textAnchor="start" verticalAnchor="middle" scaleToFit>
        {value}
      </Text>
    );
  };

  let ctx;

  export const measureText14HelveticaNeue = text => {
    if (!ctx) {
      ctx = document.createElement("canvas").getContext("2d");
      ctx.font = "14px 'Helvetica Neue";
    }
  
    return ctx.measureText(text).width;
  };
  const BAR_AXIS_SPACE = 10;
export default function TopExpenses({data, xKey="name", yKey="value"}) {
    const maxTextWidth = useMemo(
        () =>
          data.reduce((acc, cur) => {
            const value = cur[yKey];
            const width = measureText14HelveticaNeue(value.toLocaleString());
            if (width > acc) {
              return width;
            }
            return acc;
          }, 0),
        [data, yKey]
      );
  return (
    <ResponsiveContainer width={"100%"} height={50 * data.length} debounce={50}>
    <BarChart width={150} height={40} data={data} layout="vertical" margin={{ left: 10, right: maxTextWidth + (BAR_AXIS_SPACE - 8) }}>
      <XAxis hide axisLine={false} type="number" />
      <YAxis
          yAxisId={0}
          dataKey={yKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tick={YAxisLeftTick}
        />
        <YAxis
          orientation="left"
          yAxisId={1}
          dataKey={xKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tickFormatter={value => value.toLocaleString()}
          mirror
          tick={{
            transform: `translate(${-maxTextWidth - BAR_AXIS_SPACE-40}, 0)`
          }}
        />
      <Bar dataKey={yKey} fill="#8884d8" minPointSize={2} barSize={22}>
      {data.map((d, idx) => {
            return <Cell key={d[xKey]}/>;
          })}
      </Bar>
    </BarChart>
    </ResponsiveContainer>
  );
}
