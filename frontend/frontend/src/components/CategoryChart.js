import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ expenses }) => {
    const categories = {};
    expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: [
                '#00f2fe', '#4facfe', '#00f5a0', '#8b5cf6', 
                '#ec4899', '#f59e0b', '#ef4444', '#64748b'
            ],
            borderWidth: 2,
            borderColor: '#151821',
            hoverOffset: 15
        }]
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#8e94a5',
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 11 }
                }
            },
            tooltip: {
                backgroundColor: '#151821',
                titleColor: '#00f2fe',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12
            }
        },
        cutout: '75%'
    };

    return (
        <div className="pro-card" style={{marginTop: '24px'}}>
            <h3 className="card-title">Allocation Analysis</h3>
            <div style={{height: '280px', display: 'flex', justifyContent: 'center'}}>
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};

export default CategoryChart;
