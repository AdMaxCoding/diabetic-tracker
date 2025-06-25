export default function Hero(){
    const check =<i className="fa-solid fa-square-check"></i>
    return(
        <>
        <h1>Improving blood sugars made easy!</h1>
        <div className="benefits-list">
            <h3>
                Try <span className="text-gradient">GlucoLog</span> and start...
            </h3>
            <p>{check} Tracking blood sugars & meals</p>
            <p>{check} Seeing patterns </p>
            <p>{check} Getting feedback on how to improve</p>
        </div>
        <div className="card info-card">
            <div>
                <i className="fa-solid fa-circle-info"></i>
                <h3> did you know...</h3>
            </div>
            <h5>
                That insulin doesn't act instantly?
            </h5>
            <p>When you take rapid-acting insulin, it usually starts working within 15 minutes, peaks around 1–2 hours, and lasts up to 4–6 hours.
That means if you eat 50g of carbs and dose insulin right before, your glucose may rise before the insulin fully kicks in — especially if it’s a fast meal like cereal or juice!
</p>
        </div>
        
        </>
    )
}