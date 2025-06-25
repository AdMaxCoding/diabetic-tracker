import { statusLevels, calculateAvgBloodSugar, countHighsLast30Days, countLowsLast30Days, calculateBloodSugarVariabilityLast30Days,  calculateAvgEntriesPerDayLast30Days, totalLast30Days, calculateInsulinToCarbRatioStringLast30Days, calculateAvgMealPerDayLast30Days} from "../utils"
import { useAuth } from "../context/AuthContext"

function StatCard(props){
const {lg, title, children} = props
    return(
        <div className={'card stat-card' + (lg ? ' col-span-2':' ')}>
            <h4>{title}</h4>
            {children}
        </div>

    )
}

export default function Stats(){
    const {globalData} = useAuth()
    const avgBloodSugar = calculateAvgBloodSugar(globalData);
    const high30 = countHighsLast30Days(globalData);
    const low30 = countLowsLast30Days(globalData);
    const total30 = totalLast30Days(globalData);
    const inRange30   = totalLast30Days(globalData) - high30 - low30;
    const icRatio = calculateInsulinToCarbRatioStringLast30Days(globalData);
    const variability = calculateBloodSugarVariabilityLast30Days(globalData);
    const avgEntries   = calculateAvgEntriesPerDayLast30Days(globalData);
    const avgMeal = calculateAvgMealPerDayLast30Days(globalData);
    const warningLevel = avgBloodSugar < statusLevels['low'].maxLevel ? 'low': avgBloodSugar < statusLevels['healthy'].maxLevel ? 'healthy': 'high'
    return(
        <>
        <div className="section-header">
            <i className="fa-solid fa-chart-simple"/>
            <h2>30 Day Stats</h2>
        </div>
        <div className="stats-grid">
            <StatCard lg title="Average Blood Sugar">
                <div className="status">
                    <p>
                        <span className="stat-text">{avgBloodSugar} mmol/L</span>
                    </p>
                    <h5 style={{color: statusLevels[warningLevel].color, background: statusLevels[warningLevel].background}}>{warningLevel}</h5>
                </div>
                <p>{statusLevels[warningLevel].description}</p>
            </StatCard>
            <StatCard title="Average Insulin To Carb Ratio"><p><span className="stat-text">{icRatio}</span></p></StatCard>
            <StatCard title="Avg Meal Carb Count"><p><span className="stat-text">{avgMeal}g</span></p></StatCard>
            <StatCard title="Blood Sugar Variability"><p> <span className="stat-text">{`±${variability}`} mmol/L</span></p></StatCard>
            <StatCard title="Average Enteries Per Day"><p> <span className="stat-text">{avgEntries}</span></p></StatCard>
            <table className='stat-table'>
                  <thead>
                        <tr>
                        <th>Range</th>
                        <th>Count</th>
                        <th>% of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                        { label: "Low (< 4 mmol/L)", count: low30 },
                        { label: "In-Range (4–8.9 mmol/L)", count: inRange30 },
                        { label: "High (> 8.9 mmol/L)", count: high30 }
                        ].map((row, i) => {
                        const pct = total30 > 0 ? Math.round((row.count/total30)*100) : 0;
                        return (
                            <tr key={i}>
                            <td>{row.label}</td>
                            <td>{row.count}</td>
                            <td>{pct}%</td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>

        </div>
        </>
    )
}