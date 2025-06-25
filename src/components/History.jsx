import { useAuth } from "../context/AuthContext";
import React from "react";
import { timeSinceConsumption } from "../utils";

export default function History(){
    const {globalData} = useAuth()
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - WEEK_MS;
    const recentEntries = Object.entries(globalData)
    .filter(([ts, entry]) => Number(ts) >= cutoff)
    .sort((a, b) => Number(b[0]) - Number(a[0])); 

     const getColor = bs =>
    bs < 4    ? "#60a5fa"  // blue
  : bs <= 8.9  ? "#34d399"  // green
              : "#f87171"; // red

    return(
        <>
        <div className="section-header">
            <i className="fa-solid fa-timeline"/>
            <h2>Last 7 Days</h2>
        </div>
        <p>
            <i> Hover for more information</i>
        </p>
        <div className="log-history">
        {recentEntries.map(([ts, entry]) => {
          const timeAgo = timeSinceConsumption(Number(ts));
          const { bloodSugar, carbs, insulin } = entry;
          const color = getColor(bloodSugar);

          // Build the hover text
          const tooltip = `
            ${new Date(Number(ts)).toLocaleString()}  
            BG: ${bloodSugar} mmol/L  
            Carbs: ${carbs} g  
            Insulin: ${insulin} U  
            (${timeAgo} ago)
          `;

          return (
            <div
              key={ts}
              className="history-icon"
              title={tooltip.trim()}
              style={{ color }}
            >
              <i className="fa-solid fa-droplet fa-2x" />
            </div>
          );
        })}
      </div>
    </>
  );
}