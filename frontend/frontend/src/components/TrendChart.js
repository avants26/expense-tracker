import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const TrendChart = ({ expenses }) => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyTotals = last7Days.map(date => {
        return expenses
            .filter(e => e.date.split('T')[0] === date)
            .reduce((sum, e) => sum + e.amount, 0);
    });

    const data = {
        labels: last7Days.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short' })),
        datasets: [
            {
                label: 'Capital Outflow',
                data: dailyTotals,
                fill: true,
                backgroundColor: 'rgba(0, 242, 254, 0.05)',
                borderColor: '#00f2fe',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#00f2fe',
                pointBorderColor: '#151821',
                pointHoverRadius: 8,
                pointRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#151821',
                padding: 12,
                titleColor: '#00f2fe',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: '#8e94a5', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#8e94a5', font: { size: 10 } }
            }
        }
    };

    return (
        <div className="pro-card" style={{height: '320px'}}>
            <h3 className="card-title">Transaction Velocity (7D)</h3>
            <div style={{height: '240px'}}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default TrendChart;
